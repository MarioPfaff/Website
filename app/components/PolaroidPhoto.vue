<script setup lang="ts">
import type { Photo } from '~/models/Content'
import { createAssetUrl } from '~/utils/asset'
import type { TapeColour, TapePosition } from '~/composables/usePolaroid'
const property = withDefaults(
  defineProps<{
    photo: Photo
    tilt?: number
    tape?: TapeColour
    tapePosition?: TapePosition
    ratio?: string
    eager?: boolean
  }>(),
  { tilt: 2, tape: 'rust', tapePosition: 'middle', ratio: '4 / 3', eager: false }
)
const loading = property.eager ? 'eager' : 'lazy'
const polaroidStyle = computed(() => ({
  '--polaroid-tilt': `${property.tilt}deg`,
  '--polaroid-tape': `var(--tape-${property.tape})`,
  '--polaroid-ratio': property.ratio
}))
</script>

<template>
  <figure
    class="polaroid"
    :class="`polaroid-tape-${tapePosition}`"
    :style="polaroidStyle"
  >
    <img
      :src="createAssetUrl(photo.src)"
      :alt="photo.alt"
      :loading="loading"
      decoding="async"
    />
    <figcaption v-if="photo.caption">{{ photo.caption }}</figcaption>
  </figure>
</template>
