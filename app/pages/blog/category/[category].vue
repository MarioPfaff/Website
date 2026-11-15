<script setup lang="ts">
import { contentRepository } from '~/repositories/ContentRepository'
definePageMeta({ key: (route) => route.fullPath })
const route = useRoute()
const category = contentRepository.findCategory(route.params.category)
if (!category) throw createError({ statusCode: 404, statusMessage: 'Category not found' })
const description = `Posts filed under ${category.name}.`
usePageMeta({ title: category.name, description })
</script>
<template>
  <BlogArchive
    :title="category.name"
    :description="description"
    :category="category.slug"
  />
</template>
