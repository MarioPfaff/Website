<script setup lang="ts">
import type { Post } from '~/models/Content'
defineProps<{ post: Post }>()
</script>

<template>
  <article class="writing-row">
    <div class="writing-meta mono">
      <CategoryLabel
        :slug="post.category"
        :name="post.categoryName"
        :tone="post.categoryTone"
      />
      <time :datetime="post.date">{{ post.date }}</time>
    </div>
    <h3>
      <NuxtLink
        :to="post.url"
        class="post-title"
      >
        {{ post.title }}
      </NuxtLink>
    </h3>
    <p v-if="post.description">{{ post.description }}</p>
  </article>
</template>
