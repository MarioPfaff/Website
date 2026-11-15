import { resolve, dirname } from 'node:path'
import MarkdownIt from 'markdown-it'
import { throwContentError } from './ContentValidation.mjs'

export class MarkdownRenderer {
  constructor(mediaLibrary, sourceUrlMap, baseUrlPrefix) {
    this.mediaLibrary = mediaLibrary
    this.sourceUrlMap = sourceUrlMap
    this.baseUrlPrefix = baseUrlPrefix
  }

  createPublicUrl(publicUrl) {
    return this.baseUrlPrefix + publicUrl.replace(/^\//, '')
  }

  render(markdownContent, sourceFilePath) {
    const createPublicUrl = this.createPublicUrl.bind(this)
    const mediaLibrary = this.mediaLibrary
    const sourceUrlMap = this.sourceUrlMap
    const markdownParser = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true
    })
    const renderImageToken = markdownParser.renderer.rules.image
    markdownParser.renderer.rules.image = (
      tokenCollection,
      tokenIndex,
      rendererOption,
      environment,
      renderer
    ) => {
      const token = tokenCollection[tokenIndex]
      const imageUrl = token.attrGet('src') || ''
      if (mediaLibrary.isReference(imageUrl))
        token.attrSet('src', createPublicUrl(mediaLibrary.getUrl(imageUrl, sourceFilePath)))
      else if (imageUrl.startsWith('/') && !imageUrl.startsWith('//'))
        token.attrSet('src', createPublicUrl(imageUrl))
      else if (imageUrl && !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(imageUrl)) {
        const resolvedPath = resolve(
          dirname(sourceFilePath),
          decodeURIComponent(imageUrl.split(/[?#]/)[0])
        )
        token.attrSet('src', createPublicUrl(mediaLibrary.getUrl(resolvedPath, sourceFilePath)))
      }
      token.attrSet('loading', 'lazy')
      return renderImageToken(tokenCollection, tokenIndex, rendererOption, environment, renderer)
    }
    markdownParser.renderer.rules.link_open = (
      tokenCollection,
      tokenIndex,
      rendererOption,
      environment,
      renderer
    ) => {
      const token = tokenCollection[tokenIndex]
      const linkUrl = token.attrGet('href') || ''
      if (linkUrl.startsWith('/') && !linkUrl.startsWith('//'))
        token.attrSet('href', createPublicUrl(linkUrl))
      else if (/\.md(?:#.*)?$/.test(linkUrl)) {
        const [contentFilePath, fragment] = linkUrl.split('#')
        const targetPath = sourceUrlMap.get(
          resolve(dirname(sourceFilePath), decodeURIComponent(contentFilePath))
        )
        if (!targetPath)
          throwContentError(
            sourceFilePath,
            `Markdown link points to an unpublished or missing file: ${contentFilePath}`
          )
        token.attrSet('href', createPublicUrl(targetPath) + (fragment ? `#${fragment}` : ''))
      }
      return renderer.renderToken(tokenCollection, tokenIndex, rendererOption)
    }
    return markdownParser.render(markdownContent)
  }
}
