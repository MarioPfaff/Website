<script setup lang="ts">
import type { CategoryTone } from '~/models/Content'
const property = defineProps<{ slug: string; name: string; tone: CategoryTone }>()
const labelStyle = computed(() => ({
  '--label-background': `var(--tone-${property.tone})`,
  '--label-ink': `var(--tone-${property.tone}-ink)`
}))
</script>

<template>
  <NuxtLink
    class="category-label"
    :style="labelStyle"
    :to="`/blog/category/${slug}`"
  >
    {{ name }}
  </NuxtLink>
</template>
