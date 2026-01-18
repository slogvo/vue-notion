<script lang="ts">
export default {
  name: 'PageIcon'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import type { Block } from '@slogvo/notion-types'
import { getBlockIcon, getBlockTitle } from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs, isUrl } from '../utils'
import LazyImage from './LazyImage.vue'

const props = withDefaults(
  defineProps<{
    block: Block
    className?: string
    inline?: boolean
    hideDefaultIcon?: boolean
    defaultIcon?: string | null
  }>(),
  {
    inline: true,
    hideDefaultIcon: false
  }
)

const { recordMap, mapImageUrl, darkMode } = useNotionContext()

const icon = computed(
  () => getBlockIcon(props.block, recordMap)?.trim() || props.defaultIcon
)
const title = computed(() => getBlockTitle(props.block, recordMap))

const isImageIcon = computed(() => {
  return icon.value && (isUrl(icon.value) || icon.value.startsWith('/icons/'))
})

const imageUrl = computed(() => {
  if (!icon.value) return undefined
  if (isUrl(icon.value)) {
    return mapImageUrl(icon.value, props.block)
  }
  if (icon.value.startsWith('/icons/')) {
    return `https://www.notion.so${icon.value}?mode=${darkMode ? 'dark' : 'light'}`
  }
  return undefined
})
</script>

<template>
  <div
    v-if="icon || !hideDefaultIcon"
    :class="
      cs(
        inline ? 'notion-page-icon-inline' : 'notion-page-icon-hero',
        isImageIcon ? 'notion-page-icon-image' : 'notion-page-icon-span'
      )
    "
  >
    <LazyImage
      v-if="isImageIcon"
      :src="imageUrl"
      :alt="title || 'page icon'"
      :className="cs(className, 'notion-page-icon')"
    />
    <span
      v-else-if="icon"
      :class="cs(className, 'notion-page-icon')"
      role="img"
      :aria-label="icon"
    >
      {{ icon }}
    </span>
    <!-- Default Icon placeholder -->
    <div
      v-else-if="!hideDefaultIcon"
      :class="cs(className, 'notion-page-icon')"
    >
      📄
    </div>
  </div>
</template>
