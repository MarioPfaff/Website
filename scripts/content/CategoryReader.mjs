import { categoryToneMap } from '../../app/models/SiteTheme.mjs'
import { resolve } from 'node:path'
import {
  identifierPattern,
  throwContentError,
  hasText,
  readJsonFile
} from './ContentValidation.mjs'

export class CategoryReader {
  readDefinition() {
    const categoryFilePath = resolve('content/categories.json')
    const categoryDefinition = readJsonFile(categoryFilePath)
    if (!Array.isArray(categoryDefinition.categories) || !categoryDefinition.categories.length)
      throwContentError(categoryFilePath, 'categories must be a non-empty list')
    const categoryCollection = categoryDefinition.categories.map((category) => {
      if (
        !category ||
        typeof category.id !== 'string' ||
        !identifierPattern.test(category.id) ||
        !hasText(category.name)
      )
        throwContentError(categoryFilePath, 'each category needs a lowercase id and a name')
      const tone = category.tone || 'tan'
      if (!Object.hasOwn(categoryToneMap, tone))
        throwContentError(
          categoryFilePath,
          `tone must be one of: ${Object.keys(categoryToneMap).join(', ')}`
        )
      return {
        slug: category.id,
        name: category.name.trim(),
        tone,
        count: 0
      }
    })
    if (
      new Set(categoryCollection.map((category) => category.slug)).size !==
      categoryCollection.length
    )
      throwContentError(categoryFilePath, 'duplicate category id')
    if (!categoryCollection.some((category) => category.slug === categoryDefinition.default))
      throwContentError(categoryFilePath, 'default must reference a defined category id')
    return {
      categories: categoryCollection,
      defaultCategoryIdentifier: categoryDefinition.default
    }
  }
}
