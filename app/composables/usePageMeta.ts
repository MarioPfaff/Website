import { contentRepository } from '~/repositories/ContentRepository'

interface PageMeta {
  title?: string
  description: string
}

// Sets the page's title ("Page — Mario Pfaff") and description in one place.
export function usePageMeta(pageMeta: PageMeta) {
  const siteName = contentRepository.getSite().name
  useSeoMeta({
    title: pageMeta.title ? `${pageMeta.title} — ${siteName}` : siteName,
    description: pageMeta.description
  })
}
