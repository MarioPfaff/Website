<script setup lang="ts">
defineProps<{ title: string; id?: string }>()
</script>

<template>
  <div class="section-heading">
    <h2 :id="id">{{ title }}</h2>
    <slot />
  </div>
</template>
