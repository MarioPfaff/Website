import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

// Compile content/ into app/data/content.json in a separate process, so changes to both the
// content and the content scripts are picked up whenever the config reloads.
execFileSync(process.execPath, ['scripts/build-content.mjs'], { stdio: 'inherit' })
const contentCatalog = JSON.parse(readFileSync('app/data/content.json', 'utf8'))
const baseUrl = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  // Reload the config (and so rebuild the content) when content or the content scripts change.
  watch: [/[\\/]content[\\/]/, /[\\/]scripts[\\/]/],
  css: ['~/assets/main.css'],
  dir: { public: '.generated/public' },
  app: {
    baseURL: baseUrl,
    head: {
      htmlAttrs: { lang: 'en' },
      title: contentCatalog.site.name,
      meta: [
        {
          name: 'description',
          content: contentCatalog.site.description || contentCatalog.site.introText
        }
      ]
    }
  },
  nitro: { prerender: { crawlLinks: true, routes: contentCatalog.routes } }
})
