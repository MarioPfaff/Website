<script setup lang="ts">
const property = defineProps<{
  title: string
  description: string
  category?: string
  tag?: string
}>()
const archive = useArchive(property)
// A filtered archive's title already says what it shows.
const introDescription = archive.isShowingEverything ? property.description : undefined
</script>

<template>
  <div>
    <PageIntro
      :title="title"
      :description="introDescription"
    />
    <div class="shell detail blog-archive">
      <CategoryNavigation
        :category="category"
        :tag="tag"
      />
      <div class="blog-columns">
        <section :aria-label="title">
          <WritingList
            :category="category"
            :tag="tag"
          />
        </section>
        <TagNavigation
          :category="category"
          :tag="tag"
        />
      </div>
    </div>
  </div>
</template>
