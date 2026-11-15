import { readdirSync, existsSync, lstatSync } from 'node:fs'
import { join, basename } from 'node:path'
import { createSlug } from '../../app/data/taxonomy.mjs'
import {
  identifierPattern,
  throwContentError,
  hasText,
  isMissing,
  isDraft,
  readMarkdownFile,
  readLabelCollection
} from './ContentValidation.mjs'

export class PostReader {
  constructor(categoryCollection, defaultCategoryIdentifier) {
    this.categoryCollection = categoryCollection
    this.defaultCategoryIdentifier = defaultCategoryIdentifier
    this.postCollection = []
    this.postSourceMap = new Map()
  }

  // Blog posts live in content/blog. Build notes live in content/notes and name their project
  // in a `project` field (a project id such as `frankensynth`, or the path the CMS stores).
  readDirectory(directoryPath, projectContext = null) {
    if (!existsSync(directoryPath)) return
    if (lstatSync(directoryPath).isSymbolicLink())
      throwContentError(directoryPath, 'symbolic links are not supported')
    for (const directoryEntry of readdirSync(directoryPath, {
      withFileTypes: true
    })) {
      if (!directoryEntry.name.endsWith('.md') || directoryEntry.name.startsWith('.')) continue
      const contentFilePath = join(directoryPath, directoryEntry.name)
      if (!directoryEntry.isFile() || directoryEntry.isSymbolicLink())
        throwContentError(contentFilePath, 'posts must be regular Markdown files')
      this.readFile(contentFilePath, projectContext)
    }
  }

  readFile(contentFilePath, projectContext) {
    const categoryCollection = this.categoryCollection
    const postSourceMap = this.postSourceMap
    const postCollection = this.postCollection

    const { data: metadata, content: markdownContent } = readMarkdownFile(contentFilePath)
    if (isDraft(metadata, contentFilePath)) return
    const slug = basename(contentFilePath, '.md')
    if (!identifierPattern.test(slug))
      throwContentError(contentFilePath, 'use a lowercase filename with hyphens or underscores')
    const date =
      metadata.date instanceof Date ? metadata.date.toISOString().slice(0, 10) : metadata.date
    if (
      !hasText(metadata.title) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(String(date)) ||
      Number.isNaN(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date
    )
      throwContentError(contentFilePath, 'title and a valid YYYY-MM-DD date are required')
    const project = this.findProject(metadata, contentFilePath, projectContext)
    if (project === false) return
    const category = categoryCollection.find(
      (category) => category.slug === (metadata.category ?? this.defaultCategoryIdentifier)
    )
    if (!category)
      throwContentError(contentFilePath, 'category must reference an id in content/categories.json')
    const tagCollection = readLabelCollection(metadata, 'tags', contentFilePath)
    if (tagCollection.some((tag) => tag.length > 50 || !createSlug(tag)))
      throwContentError(contentFilePath, 'tags must be short labels with letters or numbers')
    const publicUrl = project ? `${project.postsUrl}/${slug}` : `/blog/${slug}`
    const post = {
      slug,
      url: publicUrl,
      title: metadata.title.trim(),
      description: String(metadata.description || ''),
      category: category.slug,
      categoryName: category.name,
      categoryTone: category.tone,
      tags: tagCollection,
      project: project?.id || null,
      projectTitle: project?.title || null,
      date,
      minutes: Math.max(
        1,
        Math.ceil(markdownContent.trim().split(/\s+/).filter(Boolean).length / 200)
      ),
      html: ''
    }
    postSourceMap.set(contentFilePath, {
      post,
      content: markdownContent
    })
    postCollection.push(post)
    category.count++
  }

  findProject(metadata, contentFilePath, projectContext) {
    if (!projectContext) {
      if (!isMissing(metadata.project))
        throwContentError(
          contentFilePath,
          'blog posts don’t belong to a project; move build notes to content/notes'
        )
      return null
    }
    if (!hasText(metadata.project))
      throwContentError(
        contentFilePath,
        'build notes need a project field, e.g. project: frankensynth'
      )
    const projectIdentifier = basename(metadata.project.trim(), '.md')
    if (projectContext.draftIdentifierSet.has(projectIdentifier)) return false
    const project = projectContext.projectMap.get(projectIdentifier)
    if (!project)
      throwContentError(
        contentFilePath,
        `project must match a file in content/projects: ${metadata.project}`
      )
    return project
  }
}
