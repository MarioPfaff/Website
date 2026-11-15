import { contentRepository } from '~/repositories/ContentRepository'
import type { Post } from '~/models/Content'

// Where "back" goes from a post: its project's build notes, or the writing archive.
export function usePost(post: Post) {
  const backLink = post.project
    ? { url: `/projects/${post.project}/posts`, label: `${post.projectTitle}: build notes` }
    : { url: '/blog', label: 'Writing' }

  return { backLink }
}

// The post named in the current address (a blog post, or a build note of the address's
// project), or a 404 page.
export function useRoutePost() {
  const route = useRoute()
  const post = contentRepository.findPost(route.params.slug, route.params.project ?? null)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  return post
}
