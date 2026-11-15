import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { buildContent } from '../scripts/catalog.mjs'
const categoryDefinition = {
  default: 'personal',
  categories: [
    {
      id: 'electronics',
      name: 'Electronics'
    },
    {
      id: 'personal',
      name: 'Personal'
    }
  ]
}
const createProject = (title, extraFrontmatter = '') =>
  `---\ntitle: ${title}\ndescription: Test project description\ntechnologies: [C++]\nstatus: In progress\ndraft: false\n${extraFrontmatter}\n---\nProject overview.`
function writeFixture(filePath, fixtureContent) {
  mkdirSync(dirname(filePath), {
    recursive: true
  })
  writeFileSync(
    filePath,
    typeof fixtureContent === 'object' && !Buffer.isBuffer(fixtureContent)
      ? JSON.stringify(fixtureContent)
      : fixtureContent
  )
}
const createPost = (frontmatter = '') =>
  `---\ntitle: Test post\ndate: "2026-11-14"\ndraft: false\n${frontmatter}\n---\n## Notes\n\nTest writing.`
function withFixture(runTest) {
  const previousDirectory = process.cwd()
  const previousBaseUrl = process.env.NUXT_APP_BASE_URL
  const fixtureDirectoryPath = mkdtempSync(join(tmpdir(), 'portfolio-content-'))
  try {
    process.chdir(fixtureDirectoryPath)
    delete process.env.NUXT_APP_BASE_URL
    writeFixture('content/categories.json', categoryDefinition)
    runTest()
  } finally {
    process.chdir(previousDirectory)
    if (previousBaseUrl === undefined) delete process.env.NUXT_APP_BASE_URL
    else process.env.NUXT_APP_BASE_URL = previousBaseUrl
    assert.ok(fixtureDirectoryPath.startsWith(join(tmpdir(), 'portfolio-content-')))
    rmSync(fixtureDirectoryPath, {
      recursive: true,
      force: true
    })
  }
}
test('discovers projects and build notes, with distinct canonical addresses and no drafts', () =>
  withFixture(() => {
    writeFixture('content/projects/frankensynth.md', createProject('Frankensynth'))
    writeFixture('content/projects/another-project.md', createProject('Another project'))
    writeFixture(
      'content/notes/frankensynth-update.md',
      createPost('category: electronics\nproject: frankensynth\ntags: [C++, learning, learning]')
    )
    // The CMS stores a reference as the project's file path.
    writeFixture(
      'content/notes/another-update.md',
      createPost('category: electronics\nproject: content/projects/another-project.md')
    )
    writeFixture('content/blog/update.md', createPost())
    writeFixture('content/blog/draft.md', '---\ndraft: true\n---\nNever publish this')
    writeFixture(
      'content/projects/private-project.md',
      '---\ndraft: true\nphotos:\n  - { src: /media/images/private.png, alt: Private }\n---\n'
    )
    writeFixture('content/notes/private.md', createPost('project: private-project'))
    writeFixture('content/images/private.png', Buffer.from('private fixture'))
    const contentCatalog = buildContent()
    assert.equal(contentCatalog.projects.length, 2)
    assert.equal(contentCatalog.posts.length, 3)
    assert.equal(
      contentCatalog.categories.find((category) => category.slug === 'electronics').count,
      2
    )
    assert.equal(contentCatalog.tags.find((tag) => tag.slug === 'c-plus-plus').count, 1)
    assert.ok(contentCatalog.routes.includes('/projects/another-project/posts/another-update'))
    assert.ok(contentCatalog.routes.includes('/projects/another-project/posts'))
    assert.ok(contentCatalog.routes.includes('/blog/update'))
    assert.ok(!contentCatalog.routes.includes('/blog/draft'))
    const projectPost = contentCatalog.posts.find((post) => post.project === 'frankensynth')
    assert.equal(projectPost.projectTitle, 'Frankensynth')
    assert.deepEqual(projectPost.tags, ['C++', 'learning'])
    assert.equal(contentCatalog.posts.find((post) => !post.project).category, 'personal')
    assert.doesNotMatch(
      readFileSync('app/data/content.json', 'utf8'),
      /Never publish this|private-project|private\.png/
    )
    assert.equal(existsSync('.generated/public/media/images/private.png'), false)
  }))
test('images, site settings and Markdown links work at a repository subpath', () =>
  withFixture(() => {
    writeFixture(
      'content/projects/test-synth.md',
      createProject(
        'Test synth',
        'photos:\n  - { src: /media/images/front.png, alt: Test panel, caption: Caption }'
      ) + '\n\n![Panel](../images/front.png)'
    )
    writeFixture('content/images/front.png', Buffer.from('binary image fixture'))
    writeFixture('content/images/desk.png', Buffer.from('desk'))
    writeFixture('content/images/unused.png', Buffer.from('unused'))
    writeFixture(
      'content/notes/first.md',
      createPost('category: electronics\nproject: test-synth') +
        '\n\n![Panel](/media/images/front.png)\n\n[Overview](../projects/test-synth.md)\n\n<script>alert(1)</script>'
    )
    writeFixture('content/site.json', {
      name: 'Test name',
      introTitle: 'Hello',
      photo: { src: '/media/images/desk.png', alt: 'A desk', caption: '' },
      now: [
        { label: 'playing', value: 'a game' },
        { label: 'reading', value: '' }
      ],
      githubUrl: 'https://example.com'
    })
    writeFixture(
      'content/about.md',
      '---\ntitle: About\n---\nAbout [Test synth](projects/test-synth.md).'
    )
    writeFixture('public/robots.txt', 'public file')
    process.env.NUXT_APP_BASE_URL = '/portfolio/'
    const contentCatalog = buildContent()
    assert.match(contentCatalog.projects[0].html, /src="\/portfolio\/media\/images\/front.png"/)
    assert.match(contentCatalog.posts[0].html, /src="\/portfolio\/media\/images\/front.png"/)
    assert.match(contentCatalog.posts[0].html, /href="\/portfolio\/projects\/test-synth"/)
    assert.match(contentCatalog.about.html, /href="\/portfolio\/projects\/test-synth"/)
    assert.doesNotMatch(contentCatalog.posts[0].html, /<script>/)
    assert.equal(contentCatalog.projects[0].photos[0].src, '/media/images/front.png')
    assert.equal(contentCatalog.site.photo.src, '/media/images/desk.png')
    assert.deepEqual(contentCatalog.site.now, [{ label: 'playing', value: 'a game' }])
    assert.equal(
      readFileSync('.generated/public/media/images/front.png', 'utf8'),
      'binary image fixture'
    )
    assert.equal(existsSync('.generated/public/media/images/unused.png'), false)
    assert.equal(readFileSync('.generated/public/robots.txt', 'utf8'), 'public file')
    assert.equal(existsSync('.generated/public/content'), false)
    // Rebuilding removes images that only a now-draft project used.
    writeFixture('content/projects/test-synth.md', '---\ndraft: true\n---\n')
    rmSync('content/notes', { recursive: true })
    writeFixture('content/about.md', 'About.')
    buildContent()
    assert.equal(existsSync('.generated/public/media/images/front.png'), false)
  }))
test('rejects ambiguous metadata, unknown categories and projects, and missing alt text', () =>
  withFixture(() => {
    writeFixture('content/blog/check.md', createPost('category: missing'))
    assert.throws(buildContent, /category must reference an id/)
    writeFixture('content/blog/check.md', createPost('project: frankensynth'))
    assert.throws(buildContent, /move build notes to content\/notes/)
    writeFixture('content/blog/check.md', createPost('tags: not-an-array'))
    assert.throws(buildContent, /tags must be a list/)
    writeFixture('content/blog/check.md', createPost().replace('2026-11-14', '2026-02-30'))
    assert.throws(buildContent, /valid YYYY-MM-DD date/)
    writeFixture('content/blog/check.md', createPost('tags: [C++]'))
    writeFixture('content/blog/other.md', createPost('tags: [c++]'))
    assert.throws(buildContent, /duplicate URLs/)
    writeFixture('content/blog/other.md', '---\ndraft: true\n---\nDraft')
    writeFixture('content/notes/orphan.md', createPost('project: missing-project'))
    assert.throws(buildContent, /project must match a file/)
    writeFixture('content/notes/orphan.md', createPost())
    assert.throws(buildContent, /build notes need a project/)
    rmSync('content/notes', { recursive: true })
    writeFixture('content/images/photo.png', Buffer.from('photo'))
    writeFixture(
      'content/projects/synth.md',
      createProject('Synth', 'photos:\n  - { src: /media/images/photo.png }')
    )
    assert.throws(buildContent, /alt text/)
    writeFixture(
      'content/projects/synth.md',
      createProject('Synth', 'photos:\n  - { src: /media/images/nope.png, alt: Nope }')
    )
    assert.throws(buildContent, /image is missing/)
    rmSync('content/projects/synth.md')
    writeFixture('content/categories.json', {
      ...categoryDefinition,
      categories: [...categoryDefinition.categories, categoryDefinition.categories[0]]
    })
    assert.throws(buildContent, /duplicate category id/)
  }))
