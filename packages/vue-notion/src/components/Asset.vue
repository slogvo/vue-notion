<script lang="ts">
export default {
  name: 'NotionAsset'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import type { BaseContentBlock, Block } from '@slogvo/notion-types'
import { getTextContent } from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import LazyImage from './LazyImage.vue'
import { getYoutubeId, getUrlParams } from '../utils'

const props = defineProps<{
  block: BaseContentBlock
  zoomable?: boolean
}>()

const { recordMap, mapImageUrl, components } = useNotionContext()

const style = computed(() => {
  const s: any = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: '100%',
    flexDirection: 'column'
  }

  if (props.block.format) {
    const {
      block_aspect_ratio,
      block_height,
      block_width,
      block_full_width,
      block_page_width,
      block_preserve_scale
    } = props.block.format

    if (block_full_width || block_page_width) {
      if (block_full_width) {
        s.width = '100vw'
      } else {
        s.width = '100%'
      }

      if (props.block.type === 'video') {
        if (block_height) {
          s.height = `${block_height}px`
        } else if (block_aspect_ratio) {
          s.paddingBottom = `${block_aspect_ratio * 100}%`
        }
      } else if (block_aspect_ratio && props.block.type !== 'image') {
        s.paddingBottom = `${block_aspect_ratio * 100}%`
      } else if (block_height) {
        s.height = `${block_height}px`
      }
    } else {
      switch (props.block.format?.block_alignment) {
        case 'center':
          s.alignSelf = 'center'
          break
        case 'left':
          s.alignSelf = 'start'
          break
        case 'right':
          s.alignSelf = 'end'
          break
      }

      if (block_width) {
        s.width =
          typeof block_width === 'number' ? `${block_width}px` : block_width
      }
    }
  }

  return s
})

const assetStyle = computed(() => {
  const s: any = {}
  if (props.block.type === 'image' || isEmbedImage.value) {
    s.objectFit = 'cover'
  } else if (props.block.format?.block_preserve_scale) {
    s.objectFit = 'contain'
  }
  return s
})

const source = computed(() => {
  let src =
    recordMap.signed_urls?.[props.block.id] ||
    props.block.properties?.source?.[0]?.[0]
  if (src && props.block.space_id) {
    const url = new URL(src)
    url.searchParams.set('spaceId', props.block.space_id)
    src = url.toString()
  }
  return src
})

const isEmbedImage = computed(() => {
  if (props.block.type === 'embed' && source.value) {
    const s = source.value.toLowerCase()
    return /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/.test(s)
  }
  return false
})

const src = computed(() => {
  if ((props.block.type === 'image' || isEmbedImage.value) && source.value) {
    let s = source.value
    if (!s.includes('.gif') && s.includes('file.notion.so')) {
      s = props.block.properties?.source?.[0]?.[0]
    }
    return mapImageUrl(s, props.block as Block)
  }
  return source.value
})

const alt = computed(() => {
  const altText = getTextContent(props.block.properties?.alt_text)
  const caption = getTextContent(props.block.properties?.caption)
  return altText || caption || 'notion image'
})

const youtubeVideoId = computed(() => {
  if (props.block.type === 'video' && source.value) {
    return getYoutubeId(source.value)
  }
  return null
})
</script>

<template>
  <div v-if="source" :style="style">
    <!-- Image -->
    <component
      :is="components.Image"
      v-if="block.type === 'image' || isEmbedImage"
      :src="src"
      :alt="alt"
      :zoomable="zoomable"
      :style="assetStyle"
    />

    <!-- Video -->
    <template v-else-if="block.type === 'video'">
      <iframe
        v-if="youtubeVideoId"
        class="notion-asset-object-fit"
        :style="assetStyle"
        :src="`https://www.youtube.com/embed/${youtubeVideoId}`"
        frameBorder="0"
        allowFullScreen
        loading="lazy"
      />
      <video
        v-else
        playsInline
        controls
        preload="metadata"
        :style="assetStyle"
        :src="source"
      />
    </template>

    <!-- Embed / Iframe -->
    <iframe
      v-else-if="
        [
          'embed',
          'figma',
          'typeform',
          'gist',
          'maps',
          'excalidraw',
          'codepen',
          'replit'
        ].includes(block.type)
      "
      class="notion-asset-object-fit"
      :style="assetStyle"
      :src="source"
      frameBorder="0"
      allowFullScreen
      loading="lazy"
    />

    <!-- PDF -->
    <div v-else-if="block.type === 'pdf'" class="notion-pdf">
      <!-- Simplified PDF view -->
      <a :href="source" target="_blank">View PDF</a>
    </div>

    <slot />
  </div>
</template>
