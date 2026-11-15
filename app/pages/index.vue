<script setup lang="ts">
import { contentRepository } from '~/repositories/ContentRepository'
const { site, getNowText } = useSite()
const hasPosts = contentRepository.getPostCollection({ limit: 1 }).length > 0
const projectCollection = contentRepository.getProjectCollection()
const hasMoreProjects = projectCollection.length > 3
usePageMeta({ description: site.description || site.introText })
</script>

<template>
  <div class="home-page">
    <section
      class="home-intro shell"
      :class="{ 'home-intro-with-photo': site.photo }"
      aria-labelledby="page-title"
    >
      <div class="home-intro-text">
        <h1 id="page-title">{{ site.introTitle }}</h1>
        <p
          v-if="site.introText"
          class="home-intro-description"
        >
          {{ site.introText }}
        </p>
        <p
          v-if="site.now.length"
          class="now-line mono"
        >
          <span class="now-label">now</span>
          <span
            v-for="nowItem in site.now"
            :key="nowItem.label + nowItem.value"
          >
            {{ getNowText(nowItem) }}
          </span>
        </p>
      </div>
      <PolaroidPhoto
        v-if="site.photo"
        class="home-intro-photo"
        :photo="site.photo"
        :tilt="2.5"
        tape="rust"
        ratio="1"
        eager
      />
    </section>
    <div class="shell home-sections">
      <section
        v-if="hasPosts"
        class="section"
        aria-labelledby="writing-heading"
      >
        <SectionHeading
          id="writing-heading"
          title="Writing"
        />
        <WritingList :limit="3" />
        <NuxtLink
          class="text-link section-more"
          to="/blog"
        >
          Everything I’ve written →
        </NuxtLink>
      </section>
      <section
        v-if="projectCollection.length"
        id="projects"
        class="section"
        aria-labelledby="projects-heading"
      >
        <SectionHeading
          id="projects-heading"
          title="Projects"
        />
        <ProjectList :limit="3" />
        <NuxtLink
          v-if="hasMoreProjects"
          class="text-link section-more"
          to="/projects"
        >
          All projects →
        </NuxtLink>
      </section>
    </div>
  </div>
</template>
