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
  const v = icon.value
  if (!v) return false
  return (
    isUrl(v) ||
    v.startsWith('/icons/') ||
    v.startsWith('data:') ||
    v.startsWith('iconify:') ||
    (!v.includes(' ') && v.length > 2 && /^[a-z0-9_-]+$/i.test(v))
  )
})

const imageUrl = computed(() => {
  const v = icon.value
  if (!v) return undefined
  if (isUrl(v) || v.startsWith('data:')) {
    return mapImageUrl(v, props.block)
  }
  if (v.startsWith('iconify:')) {
    const parts = v.replace('iconify:', '').split(':')
    if (parts.length === 2) {
      return `https://api.iconify.design/${parts[0]}/${parts[1]}.svg`
    }
  }
  if (v.startsWith('/icons/')) {
    return `https://www.notion.so${v}?mode=${darkMode ? 'dark' : 'light'}`
  }
  if (!v.includes(' ') && v.length > 2 && /^[a-z0-9_-]+$/i.test(v)) {
    return `https://www.notion.so/icons/${v}_${darkMode ? 'dark' : 'light'}.svg`
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
