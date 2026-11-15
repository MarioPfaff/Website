<script setup lang="ts">
import type { PostFilter } from '~/models/Content'
const property = defineProps<PostFilter>()
const writing = useWriting(property)
</script>

<template>
  <div
    v-if="writing.postCollection.value.length"
    class="writing-list"
  >
    <PostListItem
      v-for="post in writing.postCollection.value"
      :key="post.url"
      :post="post"
    />
  </div>
  <div
    v-else
    class="empty-note"
  >
    <p>{{ writing.emptyMessage }}</p>
  </div>
</template>
