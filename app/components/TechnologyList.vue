<script setup lang="ts">
defineProps<{ technologyCollection: string[] }>()
</script>

<template>
  <div
    v-if="technologyCollection.length"
    class="tags"
  >
    <span
      v-for="technology in technologyCollection"
      :key="technology"
    >
      {{ technology }}
    </span>
  </div>
</template>
