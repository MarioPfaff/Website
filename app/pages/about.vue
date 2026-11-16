<script setup lang="ts">
import { contentRepository } from '~/repositories/ContentRepository'
const { site } = useSite()
const about = contentRepository.getAbout()
usePageMeta({ title: about.title, description: site.work || site.description })
</script>

<template>
  <div>
    <PageIntro :title="about.title" />
    <section
      class="shell detail about-page"
      :class="{ 'about-page-with-photo': about.photo }"
      :aria-label="about.title"
    >
      <div>
        <div
          class="prose"
          v-html="about.html"
        />
      </div>
      <PolaroidPhoto
        v-if="about.photo"
        class="about-photo"
        :photo="about.photo"
        :tilt="-2"
        tape="sage"
        ratio="1"
      />
    </section>
  </div>
</template>
