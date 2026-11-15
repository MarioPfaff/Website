import contentCatalog from '~/data/content.json'
import { createSlug } from '~/data/taxonomy.mjs'
import type { ContentCatalog, PostFilter } from '~/models/Content'

export class ContentRepository {
  constructor(private readonly catalog: ContentCatalog) {}

  getSite() {
    return this.catalog.site
  }

  getAbout() {
    return this.catalog.about
  }

  getPostCollection(filter: PostFilter = {}) {
    return this.catalog.posts
      .filter(
        (post) =>
          (!filter.category || post.category === filter.category) &&
          (!filter.tag || post.tags.some((tag) => createSlug(tag) === filter.tag)) &&
          (!filter.project || post.project === filter.project)
      )
      .slice(0, filter.limit)
  }

  getProjectCollection(limit?: number) {
    return this.catalog.projects.slice(0, limit)
  }

  getCategoryCollection() {
    return this.catalog.categories
  }
  getTagCollection() {
    return this.catalog.tags
  }

  findPost(slug: unknown, projectIdentifier: unknown = null) {
    return this.catalog.posts.find(
      (post) => post.slug === slug && post.project === projectIdentifier
    )
  }

  findProject(projectIdentifier: unknown) {
    return this.catalog.projects.find((project) => project.id === projectIdentifier)
  }

  findCategory(slug: unknown) {
    return this.catalog.categories.find((category) => category.slug === slug)
  }

  findTag(slug: unknown) {
    return this.catalog.tags.find((tag) => tag.slug === slug)
  }
}

export const contentRepository = new ContentRepository(contentCatalog as ContentCatalog)
