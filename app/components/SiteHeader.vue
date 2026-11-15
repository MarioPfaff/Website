<script setup lang="ts">
const { site } = useSite()
const navigation = usePageNavigation()
</script>

<template>
  <header class="header shell">
    <NuxtLink
      to="/"
      class="wordmark"
      :aria-label="`${site.name} home`"
    >
      {{ site.name }}
    </NuxtLink>
    <nav aria-label="Main navigation">
      <NuxtLink
        to="/blog"
        :class="{ active: navigation.isSectionActive('blog') }"
      >
        Writing
      </NuxtLink>
      <NuxtLink
        to="/projects"
        :class="{ active: navigation.isSectionActive('projects') }"
      >
        Projects
      </NuxtLink>
      <NuxtLink
        to="/about"
        :class="{ active: navigation.isSectionActive('about') }"
      >
        About
      </NuxtLink>
    </nav>
  </header>
</template>
