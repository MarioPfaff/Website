<script setup lang="ts">
definePageMeta({ key: (route) => route.path })
const project = useRouteProject()
const projectView = useProject(project)
usePageMeta({ title: project.title, description: project.description })
</script>
<template>
  <div>
    <ProjectHeader :project="project" />
    <div class="shell detail">
      <div
        v-if="project.html || projectView.hasExternalLinks"
        class="project-description"
      >
        <div
          v-if="project.html"
          class="prose"
          v-html="project.html"
        />
        <div
          v-if="projectView.hasExternalLinks"
          class="contact-links"
        >
          <a
            v-if="project.repositoryUrl"
            class="text-link"
            :href="project.repositoryUrl"
          >
            Code ↗
          </a>
          <a
            v-if="project.websiteUrl"
            class="text-link"
            :href="project.websiteUrl"
          >
            Website ↗
          </a>
        </div>
      </div>
      <ProjectGallery :project="project" />
      <section
        v-if="projectView.latestPost"
        class="section"
      >
        <div class="section-heading">
          <h2>Recent build notes</h2>
          <NuxtLink
            class="text-link"
            :to="project.postsUrl"
          >
            All build notes
          </NuxtLink>
        </div>
        <WritingList
          :project="project.id"
          :limit="3"
        />
      </section>
    </div>
  </div>
</template>
