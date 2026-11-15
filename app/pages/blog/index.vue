<script setup lang="ts">
const description = 'Films, games, projects, and whatever else I feel like writing about.'
usePageMeta({ title: 'Writing', description })
</script>
<template>
  <BlogArchive
    title="Writing"
    :description="description"
  />
</template>
