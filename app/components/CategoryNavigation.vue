<script setup lang="ts">
const property = defineProps<{ category?: string; tag?: string }>()
const archive = useArchive(property)
</script>

<template>
  <nav
    v-if="archive.categoryCollection.length"
    class="category-nav"
    aria-label="Writing categories"
  >
    <NuxtLink
      to="/blog"
      :class="{ selected: archive.isShowingEverything }"
      :aria-current="archive.getCurrentMarker(archive.isShowingEverything)"
    >
      Everything
    </NuxtLink>
    <NuxtLink
      v-for="category in archive.categoryCollection"
      :key="category.slug"
      :to="`/blog/category/${category.slug}`"
      :class="{ selected: archive.isCurrentCategory(category.slug) }"
      :aria-current="archive.getCurrentMarker(archive.isCurrentCategory(category.slug))"
    >
      {{ category.name }}
    </NuxtLink>
  </nav>
</template>
