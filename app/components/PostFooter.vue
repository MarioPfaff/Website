<script setup lang="ts">
import { createSlug } from '~/data/taxonomy.mjs'
import type { Post } from '~/models/Content'
defineProps<{ post: Post }>()
</script>

<template>
  <footer
    v-if="post.tags.length || post.project"
    class="post-footer"
  >
    <div class="tag-links">
      <NuxtLink
        v-for="tag in post.tags"
        :key="tag"
        :to="`/blog/tag/${createSlug(tag)}`"
      >
        {{ tag }}
      </NuxtLink>
    </div>
    <NuxtLink
      v-if="post.project"
      class="text-link"
      :to="`/projects/${post.project}`"
    >
      {{ post.projectTitle }}
    </NuxtLink>
  </footer>
</template>
