import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import {
  throwContentError,
  hasText,
  isMissing,
  readJsonFile,
  readMarkdownFile,
  readOptionalText,
  readOptionalWebAddress
} from './ContentValidation.mjs'

// Reads the site-wide settings (content/site.json) and the about page (content/about.md),
// so names, the intro, the "now" line, links and the about text can all be edited as content.
export class SiteReader {
  constructor(mediaLibrary) {
    this.mediaLibrary = mediaLibrary
  }

  readSite() {
    const contentFilePath = resolve('content/site.json')
    const metadata = existsSync(contentFilePath) ? readJsonFile(contentFilePath) : {}
    const readSiteText = (propertyName) => readOptionalText(metadata, propertyName, contentFilePath)
    return {
      name: readSiteText('name') || 'Mario Pfaff',
      description: readSiteText('description'),
      introTitle: readSiteText('introTitle') || 'Hi.',
      introText: readSiteText('introText'),
      photo: this.mediaLibrary.readPhoto(metadata.photo, dirname(contentFilePath), contentFilePath),
      now: this.readNowCollection(metadata.now, contentFilePath),
      work: readSiteText('work'),
      signOff: readSiteText('signOff'),
      githubUrl: readOptionalWebAddress(metadata, 'githubUrl', contentFilePath),
      linkedinUrl: readOptionalWebAddress(metadata, 'linkedinUrl', contentFilePath),
      email: this.readEmailAddress(metadata, contentFilePath)
    }
  }

  readAbout() {
    const contentFilePath = resolve('content/about.md')
    if (!existsSync(contentFilePath))
      return { contentFilePath, title: 'About me', photo: null, content: '' }
    const { data: metadata, content: markdownContent } = readMarkdownFile(contentFilePath)
    return {
      contentFilePath,
      title: hasText(metadata.title) ? metadata.title.trim() : 'About me',
      photo: this.mediaLibrary.readPhoto(metadata.photo, dirname(contentFilePath), contentFilePath),
      content: markdownContent
    }
  }

  readEmailAddress(metadata, contentFilePath) {
    const emailAddress = readOptionalText(metadata, 'email', contentFilePath)
    if (emailAddress && !/^[^\s@]+@[^\s@]+$/.test(emailAddress))
      throwContentError(contentFilePath, 'email must be an email address')
    return emailAddress
  }

  // The "now" line: a list of { label, value } items. Items without a value are left out.
  readNowCollection(nowCollection, contentFilePath) {
    if (isMissing(nowCollection)) return []
    if (!Array.isArray(nowCollection))
      throwContentError(contentFilePath, 'now must be a list of { label, value } items')
    return nowCollection
      .map((nowItem) => {
        if (!nowItem || typeof nowItem !== 'object')
          throwContentError(contentFilePath, 'each now item needs a label and a value')
        return {
          label: String(nowItem.label || '').trim(),
          value: String(nowItem.value || '').trim()
        }
      })
      .filter((nowItem) => nowItem.value)
  }
}
