import { contentRepository } from '~/repositories/ContentRepository'
import type { PostFilter } from '~/models/Content'

// The writing archive's current filter: which category or tag is selected, if any.
export function useArchive(filter: PostFilter) {
  const categoryCollection = contentRepository
    .getCategoryCollection()
    .filter((category) => category.count > 0)
  const tagCollection = contentRepository.getTagCollection()
  const isShowingEverything = !filter.category && !filter.tag

  function isCurrentCategory(categorySlug: string) {
    return filter.category === categorySlug
  }

  function isCurrentTag(tagSlug: string) {
    return filter.tag === tagSlug
  }

  // aria-current marks the selected link for screen readers.
  function getCurrentMarker(isCurrent: boolean) {
    return isCurrent ? 'page' : undefined
  }

  return {
    categoryCollection,
    tagCollection,
    isShowingEverything,
    isCurrentCategory,
    isCurrentTag,
    getCurrentMarker
  }
}
