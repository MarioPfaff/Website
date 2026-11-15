<script setup lang="ts">
import { contentRepository } from '~/repositories/ContentRepository'
const property = defineProps<{ limit?: number }>()
const projectCollection = computed(() => contentRepository.getProjectCollection(property.limit))
</script>

<template>
  <div
    v-if="projectCollection.length"
    class="project-list"
  >
    <ProjectCard
      v-for="(project, projectIndex) in projectCollection"
      :key="project.id"
      :project="project"
      :index="projectIndex"
    />
  </div>
  <p
    v-else
    class="empty-note muted"
  >
    No projects yet.
  </p>
</template>
