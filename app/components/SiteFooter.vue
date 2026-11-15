<script setup lang="ts">
const site = useSite()
const navigation = usePageNavigation()
const footerText = computed(() => site.getFooterText(navigation.isHomePage.value))
</script>

<template>
  <footer class="site-footer shell">
    <p class="footer-note">
      <span v-if="footerText">{{ footerText }}</span>
      <NuxtLink
        v-if="!navigation.isAboutPage.value"
        class="text-link"
        to="/about"
      >
        More about me →
      </NuxtLink>
    </p>
    <SocialLinks />
  </footer>
</template>
