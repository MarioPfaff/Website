<script setup lang="ts">
const property = defineProps<{
  title: string
  description?: string
  reading?: boolean
}>()
const titleClass = computed(() => ({
  'intro-title-long': property.title.length > 70,
  'intro-title-extended': property.title.length > 120
}))
</script>

<template>
  <section
    class="page-intro shell"
    :class="{ 'page-intro-reading': reading }"
    aria-labelledby="page-title"
  >
    <div
      v-if="$slots.before"
      class="intro-before"
    >
      <slot name="before" />
    </div>
    <h1
      id="page-title"
      :class="titleClass"
    >
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="intro-description"
    >
      {{ description }}
    </p>
    <slot />
  </section>
</template>
