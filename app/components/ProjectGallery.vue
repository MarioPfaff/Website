<script setup lang="ts">
import type { Project } from '~/models/Content'
defineProps<{ project: Project }>()
const polaroid = usePolaroid()
</script>

<template>
  <section
    v-if="project.photos.length"
    class="section"
    aria-labelledby="photos-heading"
  >
    <h2 id="photos-heading">Photos</h2>
    <div class="photo-grid">
      <PolaroidPhoto
        v-for="(photo, photoIndex) in project.photos"
        :key="photo.src"
        :photo="photo"
        v-bind="polaroid.getPlacement(photoIndex)"
      />
    </div>
  </section>
</template>
