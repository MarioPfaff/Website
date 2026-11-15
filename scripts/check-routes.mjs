import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
const publicDirectoryPath = resolve('.output/public')
const contentCatalog = JSON.parse(readFileSync('app/data/content.json', 'utf8'))
const baseUrl = '/' + (process.env.NUXT_APP_BASE_URL || '/').split('/').filter(Boolean).join('/')
for (const route of contentCatalog.routes) {
  const pageHtml = readFileSync(resolve(publicDirectoryPath, '.' + route, 'index.html'), 'utf8')
  assert.equal(
    [...pageHtml.matchAll(/<h1(?:\s|>)/g)].length,
    1,
    `Expected one page title for ${route}`
  )
  assert.match(pageHtml, /<h1[^>]*\bid="page-title"/, `Missing page title for ${route}`)
  for (const [, attributeUrl] of pageHtml.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (!attributeUrl.startsWith('/') || attributeUrl.startsWith('//')) continue
    let localPath = decodeURIComponent(attributeUrl.split(/[?#]/)[0])
    if (baseUrl !== '/' && (localPath === baseUrl || localPath.startsWith(baseUrl + '/')))
      localPath = localPath.slice(baseUrl.length) || '/'
    const absolutePath = resolve(publicDirectoryPath, `.${localPath}`)
    assert.ok(
      existsSync(absolutePath) || existsSync(resolve(absolutePath, 'index.html')),
      `Broken local asset/link: ${attributeUrl}`
    )
  }
  assert.doesNotMatch(pageHtml, /Give this (?:build note|post) a title|Never publish this/)
  assert.doesNotMatch(pageHtml, /mymemo/i)
}
assert.ok(
  !existsSync(resolve(publicDirectoryPath, 'projects/mymemo/index.html')),
  'Removed project must not be published'
)
assert.ok(
  !existsSync(resolve(publicDirectoryPath, 'content/categories.json')),
  'Raw content must not be exposed'
)
for (const project of contentCatalog.projects) {
  assert.ok(!existsSync(resolve(publicDirectoryPath, `content/projects/${project.id}.md`)))
}
console.log(
  `All ${contentCatalog.routes.length} static pages contain content and their local links/assets resolve.`
)
