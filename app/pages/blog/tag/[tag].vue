<script setup lang="ts">
import { contentRepository } from '~/repositories/ContentRepository'
definePageMeta({ key: (route) => route.fullPath })
const route = useRoute()
const tag = contentRepository.findTag(route.params.tag)
if (!tag) throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
const title = `Tagged “${tag.name}”`
const description = `Posts tagged ${tag.name}.`
usePageMeta({ title, description })
</script>
<template>
  <BlogArchive
    :title="title"
    :description="description"
    :tag="tag.slug"
  />
</template>
