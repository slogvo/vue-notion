<script setup lang="ts">
import { computed, toRefs, onMounted } from 'vue'
import type { ExtendedRecordMap, Block } from '@slogvo/notion-types'
import { defaultMapImageUrl } from '@slogvo/notion-utils'
import { provideNotionContext } from '../context'
import type {
  MapPageUrlFn,
  MapImageUrlFn,
  SearchNotionFn,
  NotionComponents
} from '../types'
import NotionBlockRenderer from './NotionBlockRenderer.vue'
import mediumZoom from 'medium-zoom'
import type { Zoom } from 'medium-zoom'

import Text from './text/Text.vue'
import PageLink from './text/PageLink.vue'
import Checkbox from './Checkbox.vue'
import NotionCollection from './Collection.vue'
import NotionModal from './Modal.vue'
import NotionHeader from './Header.vue'
import LazyImage from './LazyImage.vue'

const props = withDefaults(
  defineProps<{
    recordMap: ExtendedRecordMap
    components?: Partial<NotionComponents>
    mapPageUrl?: MapPageUrlFn
    mapImageUrl?: MapImageUrlFn
    searchNotion?: SearchNotionFn
    fullPage?: boolean
    darkMode?: boolean
    previewImages?: boolean
    showTableOfContents?: boolean
    minTableOfContentsItems?: number
    defaultPageIcon?: string
    defaultPageCover?: string
    defaultPageCoverPosition?: number
    isImageZoomable?: boolean
    hideHeader?: boolean
  }>(),
  {
    fullPage: false,
    darkMode: false,
    previewImages: false,
    defaultPageCoverPosition: 0.5,
    mapPageUrl: (pageId: string) => `/${pageId}`,
    mapImageUrl: (url: string, block: Block) =>
      defaultMapImageUrl(url, block) || url,
    hideHeader: false
  }
)

// Merge default components with user components
const mergedComponents = computed<NotionComponents>(() => ({
  Image: LazyImage,
  Link: 'a',
  PageLink: PageLink,
  Checkbox: Checkbox,
  Code: null, // Lazy load via component registration if needed, but currently handled in Block.vue
  Equation: null,
  Collection: NotionCollection,
  Modal: NotionModal,
  Pdf: null,
  Header: NotionHeader,
  Text: Text,
  ...props.components
}))

// Setup Medium Zoom
let zoom: Zoom | null = null
if (props.isImageZoomable && typeof window !== 'undefined') {
  zoom = mediumZoom({
    background: 'rgba(0, 0, 0, 0.8)',
    margin: 24
  })
}

// Provide context
provideNotionContext({
  recordMap: props.recordMap,
  components: mergedComponents.value,
  mapPageUrl: props.mapPageUrl,
  mapImageUrl: props.mapImageUrl,
  searchNotion: props.searchNotion,
  fullPage: props.fullPage,
  darkMode: props.darkMode,
  previewImages: props.previewImages,
  showTableOfContents: props.showTableOfContents,
  minTableOfContentsItems: props.minTableOfContentsItems || 3,
  defaultPageIcon: props.defaultPageIcon,
  defaultPageCover: props.defaultPageCover,
  defaultPageCoverPosition: props.defaultPageCoverPosition || 0.5,
  forceCustomImages: !!props.components?.Image,
  zoom: zoom,
  hideHeader: props.hideHeader
})
</script>

<template>
  <NotionBlockRenderer :level="0" :zoom="isImageZoomable ? zoom : null" />
</template>
