<script setup lang="ts">
defineProps<{ error: { statusCode: number } }>()
useSiteTheme()
usePageMeta({ title: 'Page not found', description: 'This page doesn’t exist.' })
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
    <main id="main">
      <PageIntro
        title="Page not found"
        description="This page doesn’t exist."
      >
        <template #before>
          <NuxtLink
            class="text-link intro-back"
            to="/"
          >
            ← Home
          </NuxtLink>
        </template>
      </PageIntro>
    </main>
    <SiteFooter />
  </div>
</template>
