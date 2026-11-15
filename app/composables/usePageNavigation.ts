export type SiteSection = 'about' | 'projects' | 'blog'

// Which part of the site the current page belongs to.
export function usePageNavigation() {
  const route = useRoute()
  const isHomePage = computed(() => route.path === '/')
  const isAboutPage = computed(() => route.path === '/about')

  function isSectionActive(section: SiteSection) {
    const sectionPath = `/${section}`
    return route.path === sectionPath || route.path.startsWith(`${sectionPath}/`)
  }

  return { isHomePage, isAboutPage, isSectionActive }
}
