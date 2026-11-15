<script setup lang="ts">
import type { Post } from '~/models/Content'
const property = defineProps<{ post: Post }>()
usePageMeta({ title: property.post.title, description: property.post.description })
</script>
<template>
  <article>
    <PostHeader :post="post" />
    <div class="shell detail reading">
      <div
        class="prose"
        v-html="post.html"
      />
      <PostFooter :post="post" />
      <a
        v-if="post.minutes >= 6"
        class="text-link back-top"
        href="#main"
      >
        Back to top ↑
      </a>
    </div>
  </article>
</template>
