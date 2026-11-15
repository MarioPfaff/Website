export interface Photo {
  src: string
  alt: string
  caption: string
}

export interface Post {
  slug: string
  url: string
  title: string
  description: string
  category: string
  categoryName: string
  categoryTone: CategoryTone
  tags: string[]
  project: string | null
  projectTitle: string | null
  date: string
  html: string
  minutes: number
}

export interface Project {
  id: string
  title: string
  description: string
  status: string
  technologies: string[]
  repositoryUrl: string
  websiteUrl: string
  url: string
  postsUrl: string
  photos: Photo[]
  html: string
}

export type CategoryTone = 'rust' | 'sage' | 'tan'

export interface ContentLabel {
  slug: string
  name: string
  count: number
}

export interface Category extends ContentLabel {
  tone: CategoryTone
}

export interface NowItem {
  label: string
  value: string
}

export interface Site {
  name: string
  description: string
  introTitle: string
  introText: string
  photo: Photo | null
  now: NowItem[]
  work: string
  signOff: string
  githubUrl: string
  linkedinUrl: string
  email: string
}

export interface About {
  title: string
  photo: Photo | null
  html: string
}

export interface PostFilter {
  category?: string
  tag?: string
  project?: string
  limit?: number
}

export interface ContentCatalog {
  site: Site
  about: About
  posts: Post[]
  projects: Project[]
  categories: Category[]
  tags: ContentLabel[]
}
