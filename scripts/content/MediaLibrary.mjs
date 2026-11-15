import { readdirSync, existsSync, lstatSync } from 'node:fs'
import { relative, extname, join, resolve } from 'node:path'
import { imageExtensionSet, throwContentError, hasText } from './ContentValidation.mjs'

// Images live in one shared folder. Content refers to them either by their public address
// (`/media/images/photo.jpg`, which is what the CMS writes) or by a path relative to the
// content file (`../images/photo.jpg`). Only images that published content uses are copied
// into the site, so a photo in a draft never becomes public.
export class MediaLibrary {
  constructor(rootDirectoryPath) {
    this.rootDirectoryPath = rootDirectoryPath
    this.imageMap = new Map()
    this.sourcePathMap = new Map()
    this.usedImageMap = new Map()
  }

  registerDirectory(directoryPath, destinationUrl) {
    if (!existsSync(directoryPath)) return
    if (lstatSync(directoryPath).isSymbolicLink())
      throwContentError(directoryPath, 'symbolic links are not supported')
    for (const directoryEntry of readdirSync(directoryPath, { withFileTypes: true })) {
      if (directoryEntry.name.startsWith('.')) continue
      const sourceFilePath = join(directoryPath, directoryEntry.name)
      const publicUrl = `${destinationUrl}/${encodeURIComponent(directoryEntry.name)}`
      if (directoryEntry.isSymbolicLink())
        throwContentError(sourceFilePath, 'symbolic links are not supported')
      if (directoryEntry.isDirectory()) this.registerDirectory(sourceFilePath, publicUrl)
      else if (imageExtensionSet.has(extname(directoryEntry.name).toLowerCase())) {
        this.imageMap.set(sourceFilePath, publicUrl)
        this.sourcePathMap.set(publicUrl, sourceFilePath)
      } else throwContentError(sourceFilePath, 'only image files belong in the images folder')
    }
  }

  isReference(imageReference) {
    return imageReference.startsWith('/media/')
  }

  // Returns the public address of an image and marks it for publishing.
  getUrl(imageReference, contentFilePath) {
    const sourceFilePath = this.isReference(imageReference)
      ? this.sourcePathMap.get(this.normaliseUrl(imageReference))
      : resolve(imageReference)
    const publicUrl = sourceFilePath && this.imageMap.get(sourceFilePath)
    if (!publicUrl)
      throwContentError(
        contentFilePath,
        `image is missing or outside content/images: ${
          sourceFilePath ? relative(this.rootDirectoryPath, sourceFilePath) : imageReference
        }`
      )
    this.usedImageMap.set(sourceFilePath, publicUrl)
    return publicUrl
  }

  normaliseUrl(imageUrl) {
    const [pathName] = imageUrl.split(/[?#]/)
    return pathName
      .split('/')
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join('/')
  }

  // Reads an optional { src, alt, caption } photo. An empty src means "no photo".
  readPhoto(photo, contentDirectoryPath, contentFilePath) {
    if (photo === undefined || photo === null || photo === '') return null
    if (typeof photo !== 'object' || Array.isArray(photo))
      throwContentError(contentFilePath, 'a photo needs src, alt and an optional caption')
    if (!hasText(photo.src)) return null
    if (!hasText(photo.alt))
      throwContentError(contentFilePath, `add descriptive alt text for ${photo.src}`)
    const imageReference = this.isReference(photo.src.trim())
      ? photo.src.trim()
      : join(contentDirectoryPath, decodeURIComponent(photo.src.trim()))
    return {
      src: this.getUrl(imageReference, contentFilePath),
      alt: photo.alt.trim(),
      caption: String(photo.caption || '').trim()
    }
  }
}
