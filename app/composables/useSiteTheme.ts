import { SiteTheme, siteThemeMap } from '~/models/SiteTheme.mjs'

export function useSiteTheme() {
  useHead({
    style: [{ key: 'site-theme', innerHTML: SiteTheme.createStyleSheet() }],
    meta: [
      {
        key: 'theme-color-light',
        name: 'theme-color',
        media: '(prefers-color-scheme: light)',
        content: siteThemeMap.light.page
      },
      {
        key: 'theme-color-dark',
        name: 'theme-color',
        media: '(prefers-color-scheme: dark)',
        content: siteThemeMap.dark.page
      }
    ]
  })
}
