<script setup lang="ts">
import type { Project } from '~/models/Content'
defineProps<{ project: Project }>()
</script>

<template>
  <PageIntro
    :title="project.title"
    :description="project.description"
  >
    <template #before>
      <NuxtLink
        class="text-link"
        to="/projects"
      >
        ← Projects
      </NuxtLink>
      <p
        v-if="project.status"
        class="project-status mono"
      >
        {{ project.status }}
      </p>
    </template>
    <TechnologyList :technology-collection="project.technologies" />
  </PageIntro>
</template>
