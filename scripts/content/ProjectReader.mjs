import { readdirSync, existsSync, lstatSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import {
  identifierPattern,
  throwContentError,
  hasText,
  isMissing,
  isDraft,
  readMarkdownFile,
  readOptionalText,
  readOptionalWebAddress,
  readLabelCollection
} from './ContentValidation.mjs'

// Each project is one Markdown file in content/projects: details in the front matter,
// the project page's text in the body. The file name is the project's address.
export class ProjectReader {
  constructor(mediaLibrary) {
    this.mediaLibrary = mediaLibrary
  }

  readCollection(projectDirectoryPath) {
    const projectCollection = []
    const projectSourceMap = new Map()
    const draftIdentifierSet = new Set()
    for (const contentFilePath of this.findFileCollection(projectDirectoryPath)) {
      const projectSource = this.readFile(contentFilePath)
      if (!projectSource) {
        draftIdentifierSet.add(basename(contentFilePath, '.md'))
        continue
      }
      projectCollection.push(projectSource.project)
      projectSourceMap.set(projectSource.project.id, {
        contentFilePath,
        content: projectSource.content
      })
    }
    projectCollection.sort(
      (firstEntry, secondEntry) =>
        firstEntry.order - secondEntry.order || firstEntry.title.localeCompare(secondEntry.title)
    )
    return { projects: projectCollection, projectSources: projectSourceMap, draftIdentifierSet }
  }

  findFileCollection(projectDirectoryPath) {
    if (!existsSync(projectDirectoryPath)) return []
    if (lstatSync(projectDirectoryPath).isSymbolicLink())
      throwContentError(projectDirectoryPath, 'symbolic links are not supported')
    const projectFileCollection = []
    for (const directoryEntry of readdirSync(projectDirectoryPath, { withFileTypes: true })) {
      if (directoryEntry.name.startsWith('.') || !directoryEntry.name.endsWith('.md')) continue
      const contentFilePath = join(projectDirectoryPath, directoryEntry.name)
      if (!directoryEntry.isFile())
        throwContentError(contentFilePath, 'projects must be regular Markdown files')
      projectFileCollection.push(contentFilePath)
    }
    return projectFileCollection
  }

  // Returns null for a draft project.
  readFile(contentFilePath) {
    const projectIdentifier = basename(contentFilePath, '.md')
    if (!identifierPattern.test(projectIdentifier))
      throwContentError(contentFilePath, 'use a lowercase file name with hyphens or underscores')
    const { data: metadata, content: markdownContent } = readMarkdownFile(contentFilePath)
    if (isDraft(metadata, contentFilePath)) return null
    if (!hasText(metadata.title) || !hasText(metadata.description))
      throwContentError(contentFilePath, 'title and description are required')
    const project = {
      id: projectIdentifier,
      title: metadata.title.trim(),
      description: metadata.description.trim(),
      status: readOptionalText(metadata, 'status', contentFilePath),
      technologies: readLabelCollection(metadata, 'technologies', contentFilePath),
      repositoryUrl: readOptionalWebAddress(metadata, 'repositoryUrl', contentFilePath),
      websiteUrl: readOptionalWebAddress(metadata, 'websiteUrl', contentFilePath),
      order: this.readOrder(metadata, contentFilePath),
      url: `/projects/${projectIdentifier}`,
      postsUrl: `/projects/${projectIdentifier}/posts`,
      photos: this.readPhotoCollection(metadata, contentFilePath),
      html: ''
    }
    return { project, content: markdownContent }
  }

  readOrder(metadata, contentFilePath) {
    if (isMissing(metadata.order)) return 0
    if (!Number.isFinite(metadata.order))
      throwContentError(contentFilePath, 'order must be a number')
    return metadata.order
  }

  readPhotoCollection(metadata, contentFilePath) {
    if (isMissing(metadata.photos)) return []
    if (!Array.isArray(metadata.photos)) throwContentError(contentFilePath, 'photos must be a list')
    return metadata.photos
      .map((photo) => this.mediaLibrary.readPhoto(photo, dirname(contentFilePath), contentFilePath))
      .filter(Boolean)
  }
}
