<script setup lang="ts">
import type { Post } from '~/models/Content'
const property = defineProps<{ post: Post }>()
const { backLink } = usePost(property.post)
</script>

<template>
  <PageIntro
    :title="post.title"
    :description="post.description"
    reading
  >
    <template #before>
      <NuxtLink
        class="text-link intro-back"
        :to="backLink.url"
      >
        ← {{ backLink.label }}
      </NuxtLink>
      <div class="post-meta mono">
        <CategoryLabel
          :slug="post.category"
          :name="post.categoryName"
          :tone="post.categoryTone"
        />
        <time :datetime="post.date">{{ post.date }}</time>
        <span>{{ post.minutes }} min read</span>
      </div>
    </template>
  </PageIntro>
</template>
