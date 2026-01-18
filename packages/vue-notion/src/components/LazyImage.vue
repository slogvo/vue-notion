<script lang="ts">
export default {
  name: 'LazyImage'
}
</script>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { normalizeUrl } from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs } from '../utils'

const props = defineProps<{
  src?: string
  alt?: string
  className?: string
  style?: any
  height?: number
  zoomable?: boolean
  priority?: boolean
}>()

const { recordMap, previewImages, forceCustomImages, components, zoom } =
  useNotionContext()

const previewImage = computed(() => {
  if (!previewImages || !props.src) return null
  return (
    recordMap?.preview_images?.[props.src] ??
    recordMap?.preview_images?.[normalizeUrl(props.src)]
  )
})

const imageRef = ref<HTMLImageElement | null>(null)

const onLoad = (e: Event) => {
  if (props.zoomable && imageRef.value && (zoom as any)) {
    ;(zoom as any).attach(imageRef.value)
  }
}
</script>

<template>
  <div
    v-if="previewImage"
    :class="cs('lazy-image-wrapper', className)"
    :style="{
      width: '100%',
      paddingBottom: height
        ? undefined
        : `${(previewImage.originalHeight / previewImage.originalWidth) * 100}%`,
      height: height ? `${height}px` : undefined
    }"
  >
    <img
      class="lazy-image-preview"
      :src="previewImage.dataURIBase64"
      :alt="alt"
      decoding="async"
    />
    <img
      ref="imageRef"
      class="lazy-image-real"
      :src="src"
      :alt="alt"
      :width="previewImage.originalWidth"
      :height="previewImage.originalHeight"
      decoding="async"
      loading="lazy"
      @load="onLoad"
    />
  </div>

  <template v-else>
    <img
      v-if="src"
      ref="imageRef"
      :class="className"
      :style="style"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      @load="onLoad"
    />
  </template>
</template>
