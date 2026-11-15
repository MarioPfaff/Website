<script setup lang="ts">
const { socialLinkCollection } = useSite()
</script>

<template>
  <nav
    v-if="socialLinkCollection.length"
    class="contact-links"
    aria-label="Elsewhere"
  >
    <a
      v-for="socialLink in socialLinkCollection"
      :key="socialLink.url"
      class="text-link"
      :href="socialLink.url"
    >
      {{ socialLink.label }}
    </a>
  </nav>
</template>
