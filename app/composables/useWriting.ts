import { contentRepository } from '~/repositories/ContentRepository'
import type { PostFilter } from '~/models/Content'

// A list of posts for the given filter, and what to say when it is empty.
export function useWriting(filter: PostFilter) {
  const postCollection = computed(() => contentRepository.getPostCollection(filter))
  const isFiltered = Boolean(filter.category || filter.tag || filter.project)
  const emptyMessage = isFiltered ? 'No posts here yet.' : 'No posts yet.'

  return { postCollection, emptyMessage }
}
