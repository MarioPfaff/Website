import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { createSlug } from '../../app/data/taxonomy.mjs'
import { throwContentError } from './ContentValidation.mjs'
import { CategoryReader } from './CategoryReader.mjs'
import { ProjectReader } from './ProjectReader.mjs'
import { PostReader } from './PostReader.mjs'
import { SiteReader } from './SiteReader.mjs'
import { MediaLibrary } from './MediaLibrary.mjs'
import { MarkdownRenderer } from './MarkdownRenderer.mjs'
import { AssetPublisher } from './AssetPublisher.mjs'

// Content layout (all of it editable through Pages CMS, see .pages.yml):
//   content/site.json        name, intro, photo, "now" line, work line, links
//   content/about.md         about page
//   content/categories.json  post categories and their label colour
//   content/blog/*.md        blog posts
//   content/projects/*.md    one file per project
//   content/notes/*.md       build notes, each naming its project
//   content/images/          uploaded images
export class ContentBuilder {
  build() {
    const rootDirectoryPath = process.cwd()
    const baseUrl =
      '/' + (process.env.NUXT_APP_BASE_URL || '/').split('/').filter(Boolean).join('/')
    const baseUrlPrefix = baseUrl === '/' ? '/' : baseUrl + '/'
    const { categories: categoryCollection, defaultCategoryIdentifier } =
      new CategoryReader().readDefinition()
    const mediaLibrary = new MediaLibrary(rootDirectoryPath)
    mediaLibrary.registerDirectory(resolve('content/images'), '/media/images')
    const siteReader = new SiteReader(mediaLibrary)
    const site = siteReader.readSite()
    const aboutSource = siteReader.readAbout()
    const {
      projects: projectCollection,
      projectSources: projectSourceMap,
      draftIdentifierSet
    } = new ProjectReader(mediaLibrary).readCollection(resolve('content/projects'))
    const postReader = new PostReader(categoryCollection, defaultCategoryIdentifier)
    postReader.readDirectory(resolve('content/blog'))
    postReader.readDirectory(resolve('content/notes'), {
      projectMap: new Map(projectCollection.map((project) => [project.id, project])),
      draftIdentifierSet
    })
    const postCollection = postReader.postCollection
    postCollection.sort(
      (firstEntry, secondEntry) =>
        secondEntry.date.localeCompare(firstEntry.date) ||
        firstEntry.url.localeCompare(secondEntry.url)
    )
    const about = { title: aboutSource.title, photo: aboutSource.photo, html: '' }
    this.renderHtml({
      projectCollection,
      projectSourceMap,
      postSourceMap: postReader.postSourceMap,
      aboutSource,
      about,
      mediaLibrary,
      baseUrlPrefix
    })
    const tagCollection = this.createTagCollection(postCollection)
    const routeCollection = this.createRouteCollection(
      projectCollection,
      postCollection,
      categoryCollection,
      tagCollection
    )
    const contentCatalog = {
      site,
      about,
      categories: categoryCollection,
      tags: tagCollection,
      projects: projectCollection,
      posts: postCollection,
      routes: routeCollection
    }
    new AssetPublisher(rootDirectoryPath, mediaLibrary.usedImageMap).publish()
    mkdirSync('app/data', { recursive: true })
    writeFileSync('app/data/content.json', JSON.stringify(contentCatalog, null, 2) + '\n')
    return contentCatalog
  }

  renderHtml({
    projectCollection,
    projectSourceMap,
    postSourceMap,
    aboutSource,
    about,
    mediaLibrary,
    baseUrlPrefix
  }) {
    const sourceUrlMap = new Map(
      [...postSourceMap].map(([sourceFilePath, { post }]) => [sourceFilePath, post.url])
    )
    for (const project of projectCollection)
      sourceUrlMap.set(projectSourceMap.get(project.id).contentFilePath, project.url)
    sourceUrlMap.set(aboutSource.contentFilePath, '/about')
    const markdownRenderer = new MarkdownRenderer(mediaLibrary, sourceUrlMap, baseUrlPrefix)
    for (const [sourceFilePath, { post, content: markdownContent }] of postSourceMap)
      post.html = markdownRenderer.render(markdownContent, sourceFilePath)
    for (const project of projectCollection) {
      const { contentFilePath, content: markdownContent } = projectSourceMap.get(project.id)
      if (markdownContent.trim())
        project.html = markdownRenderer.render(markdownContent, contentFilePath)
    }
    if (aboutSource.content.trim())
      about.html = markdownRenderer.render(aboutSource.content, aboutSource.contentFilePath)
  }

  createTagCollection(postCollection) {
    const tagNameCollection = [...new Set(postCollection.flatMap((post) => post.tags))]
    const tagCollection = tagNameCollection
      .map((tagName) => ({
        name: tagName,
        slug: createSlug(tagName),
        count: postCollection.filter((post) => post.tags.includes(tagName)).length
      }))
      .sort((firstEntry, secondEntry) => firstEntry.name.localeCompare(secondEntry.name))
    if (new Set(tagCollection.map((tag) => tag.slug)).size !== tagCollection.length)
      throwContentError('tags', 'labels produce duplicate URLs; use consistent spelling')
    return tagCollection
  }

  createRouteCollection(projectCollection, postCollection, categoryCollection, tagCollection) {
    const routeCollection = [
      '/',
      '/projects',
      '/blog',
      '/about',
      ...projectCollection.flatMap((project) => [project.url, project.postsUrl]),
      ...postCollection.map((post) => post.url),
      ...categoryCollection.map((category) => `/blog/category/${category.slug}`),
      ...tagCollection.map((tag) => `/blog/tag/${tag.slug}`)
    ]
    if (new Set(routeCollection).size !== routeCollection.length)
      throwContentError('content', 'duplicate page URL')
    return routeCollection
  }
}
