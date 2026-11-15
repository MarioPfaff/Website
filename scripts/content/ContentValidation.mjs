import { readFileSync } from 'node:fs'
import { sep } from 'node:path'
import matter from 'gray-matter'

const identifierPattern = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/
const imageExtensionSet = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg'])
const throwContentError = (contentFilePath, message) => {
  throw new Error(`${contentFilePath}: ${message}`)
}
const hasText = (value) => typeof value === 'string' && value.trim().length > 0
// An optional field that the CMS may leave empty, missing or null.
const isMissing = (value) => value === undefined || value === null || value === ''
const isWebAddress = (value) => /^https?:\/\//i.test(value)
const isWithinDirectory = (contentFilePath, directoryPath) =>
  contentFilePath.startsWith(directoryPath + sep)
const readJsonFile = (contentFilePath) => JSON.parse(readFileSync(contentFilePath, 'utf8'))
const readMarkdownFile = (contentFilePath) => matter(readFileSync(contentFilePath, 'utf8'))

// Every post and project must say whether it is a draft, so nothing is published by accident.
const isDraft = (metadata, contentFilePath) => {
  if (metadata.draft !== true && metadata.draft !== false)
    throwContentError(contentFilePath, 'set draft explicitly to true or false')
  return metadata.draft
}

const readOptionalText = (metadata, propertyName, contentFilePath) => {
  const propertyValue = metadata[propertyName]
  if (isMissing(propertyValue)) return ''
  if (typeof propertyValue !== 'string')
    throwContentError(contentFilePath, `${propertyName} must be text`)
  return propertyValue.trim()
}

const readOptionalWebAddress = (metadata, propertyName, contentFilePath) => {
  const webAddress = readOptionalText(metadata, propertyName, contentFilePath)
  if (webAddress && !isWebAddress(webAddress))
    throwContentError(contentFilePath, `${propertyName} must be an http(s) URL`)
  return webAddress
}

const readLabelCollection = (metadata, propertyName, contentFilePath) => {
  const labelCollection = isMissing(metadata[propertyName]) ? [] : metadata[propertyName]
  if (!Array.isArray(labelCollection) || labelCollection.some((label) => !hasText(label)))
    throwContentError(contentFilePath, `${propertyName} must be a list of labels`)
  return [...new Set(labelCollection.map((label) => label.trim()))]
}

export {
  identifierPattern,
  imageExtensionSet,
  throwContentError,
  hasText,
  isMissing,
  isDraft,
  isWithinDirectory,
  readJsonFile,
  readMarkdownFile,
  readOptionalText,
  readOptionalWebAddress,
  readLabelCollection
}
