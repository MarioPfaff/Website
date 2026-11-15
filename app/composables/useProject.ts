import { contentRepository } from '~/repositories/ContentRepository'
import type { Project } from '~/models/Content'

// Everything a project card or page shows that is derived from the project itself.
export function useProject(project: Project) {
  const coverPhoto = project.photos[0]
  const latestPost = contentRepository.getPostCollection({ project: project.id, limit: 1 })[0]
  const technologyText = project.technologies.join(' · ')
  const hasExternalLinks = Boolean(project.repositoryUrl || project.websiteUrl)

  return { coverPhoto, latestPost, technologyText, hasExternalLinks }
}

// The project named in the current address, or a 404 page.
export function useRouteProject() {
  const route = useRoute()
  const project = contentRepository.findProject(route.params.project)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  return project
}
