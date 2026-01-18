<script lang="ts">
export default {
  name: 'NotionBookmark'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { getTextContent } from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import LazyImage from './LazyImage.vue'

const props = defineProps<{
  block: any
}>()

const { mapImageUrl, components } = useNotionContext()

const title = computed(() => getTextContent(props.block.properties?.title))
const description = computed(() =>
  getTextContent(props.block.properties?.description)
)
const link = computed(() => props.block.properties?.link?.[0]?.[0])
const caption = computed(() => props.block.properties?.caption)

const bookmarkCover = computed(() => props.block.format?.bookmark_cover)
const bookmarkIcon = computed(() => props.block.format?.bookmark_icon)
</script>

<template>
  <div v-if="link" :class="cs('notion-bookmark', block.id)">
    <component
      :is="components.Link"
      :href="link"
      target="_blank"
      rel="noopener noreferrer"
      class="notion-bookmark-link"
    >
      <div class="notion-bookmark-info">
        <div v-if="title" class="notion-bookmark-title">
          {{ title }}
        </div>

        <div v-if="description" class="notion-bookmark-description">
          {{ description }}
        </div>

        <div class="notion-bookmark-link-row">
          <img
            v-if="bookmarkIcon"
            :src="mapImageUrl(bookmarkIcon, block)"
            class="notion-bookmark-link-icon"
            :alt="title"
          />

          <div v-if="link" class="notion-bookmark-link-text">
            {{ link }}
          </div>
        </div>
      </div>

      <div v-if="bookmarkCover" class="notion-bookmark-image">
        <LazyImage
          :src="mapImageUrl(bookmarkCover, block)"
          :alt="title"
          style="object-fit: cover"
        />
      </div>
    </component>
  </div>
</template>
