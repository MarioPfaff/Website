<script setup lang="ts">
import type { Project } from '~/models/Content'
const property = withDefaults(defineProps<{ project: Project; index?: number }>(), { index: 0 })
const projectView = useProject(property.project)
// Cards alternate sides, so the photos zig-zag down the page.
const isFlipped = property.index % 2 === 1
const placement = usePolaroid().getPlacement(property.index)
</script>

<template>
  <article
    class="project-card"
    :class="{
      'project-card-with-photo': projectView.coverPhoto,
      'project-card-flipped': isFlipped
    }"
  >
    <PolaroidPhoto
      v-if="projectView.coverPhoto"
      class="project-card-photo"
      :photo="projectView.coverPhoto"
      :tilt="placement.tilt"
      :tape="placement.tape"
      tape-position="corner"
    />
    <div class="project-card-body">
      <p
        v-if="project.status"
        class="project-status mono"
      >
        {{ project.status }}
      </p>
      <h3>
        <NuxtLink
          class="project-title"
          :to="project.url"
        >
          {{ project.title }}
        </NuxtLink>
      </h3>
      <p class="project-summary">{{ project.description }}</p>
      <p
        v-if="projectView.technologyText || projectView.latestPost"
        class="project-detail mono"
      >
        <span v-if="projectView.technologyText">{{ projectView.technologyText }}</span>
        <span v-if="projectView.latestPost">
          latest:
          <NuxtLink :to="projectView.latestPost.url">{{ projectView.latestPost.title }}</NuxtLink>
        </span>
      </p>
      <div
        v-if="projectView.latestPost || project.repositoryUrl"
        class="contact-links"
      >
        <NuxtLink
          v-if="projectView.latestPost"
          class="text-link"
          :to="project.postsUrl"
        >
          Build notes →
        </NuxtLink>
        <a
          v-if="project.repositoryUrl"
          class="text-link"
          :href="project.repositoryUrl"
        >
          Code ↗
        </a>
      </div>
    </div>
  </article>
</template>
