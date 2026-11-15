<script setup lang="ts">
const property = defineProps<{ category?: string; tag?: string }>()
const archive = useArchive(property)
</script>

<template>
  <aside
    v-if="archive.tagCollection.length"
    class="tag-sidebar"
  >
    <h2>Tags</h2>
    <div class="tag-links">
      <NuxtLink
        v-for="tag in archive.tagCollection"
        :key="tag.slug"
        :to="`/blog/tag/${tag.slug}`"
        :class="{ selected: archive.isCurrentTag(tag.slug) }"
        :aria-current="archive.getCurrentMarker(archive.isCurrentTag(tag.slug))"
      >
        {{ tag.name }}
      </NuxtLink>
    </div>
  </aside>
</template>
