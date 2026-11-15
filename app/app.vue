<script setup lang="ts">
useSiteTheme()
</script>

<template>
  <div class="site">
    <a
      class="skip"
      href="#main"
    >
      Skip to content
    </a>
    <SiteHeader />
    <main id="main"><NuxtPage /></main>
    <SiteFooter />
  </div>
</template>
