<script setup lang="ts">
definePageMeta({ key: (route) => route.path })
const project = useRouteProject()
usePageMeta({
  title: `${project.title}: build notes`,
  description: `Build notes about ${project.title}.`
})
</script>
<template>
  <div>
    <PageIntro :title="`${project.title}: build notes`">
      <template #before>
        <NuxtLink
          class="text-link"
          :to="project.url"
        >
          ← {{ project.title }}
        </NuxtLink>
      </template>
    </PageIntro>
    <div class="shell detail"><WritingList :project="project.id" /></div>
  </div>
</template>
