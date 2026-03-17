<script setup lang="ts">
import { computed, toRefs, onMounted, ref } from 'vue'
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
// import mediumZoom from 'medium-zoom'
// import type { Zoom } from 'medium-zoom'

import Text from './text/Text.vue'
import PageLink from './text/PageLink.vue'
import Checkbox from './Checkbox.vue'
import NotionCollection from './Collection.vue'
import NotionModal from './Modal.vue'
import NotionHeader from './Header.vue'
import LazyImage from './LazyImage.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css'

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
    hideTitle?: boolean
  }>(),
  {
    fullPage: false,
    darkMode: false,
    previewImages: false,
    defaultPageCoverPosition: 0.5,
    mapPageUrl: (pageId: string) => `/${pageId}`,
    mapImageUrl: (url: string, block: Block) =>
      defaultMapImageUrl(url, block) || url,
    hideHeader: false,
    hideTitle: false
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

// Setup Zoom (Disabled in favor of VueEasyLightbox to avoid layered images)
const zoom = null
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
// Lightbox state
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const lightboxImages = ref<string[]>([])

const allImageUrls = computed(() => {
  const urls: string[] = []
  if (!props.recordMap?.block) return urls

  Object.values(props.recordMap.block).forEach(block => {
    const value = block.value
    // Include both image blocks and embedded images
    const isImage = value?.type === 'image'
    const isEmbedImage =
      value?.type === 'embed' &&
      value.properties?.source?.[0]?.[0] &&
      /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(value.properties.source[0][0])

    if (isImage || isEmbedImage) {
      let src =
        props.recordMap.signed_urls?.[value.id] ||
        value.properties?.source?.[0]?.[0]
      if (src) {
        if (value.space_id) {
          try {
            const url = new URL(src)
            url.searchParams.set('spaceId', value.space_id)
            src = url.toString()
          } catch (e) {
            // Handle invalid URL if necessary
          }
        }
        const mappedUrl = props.mapImageUrl
          ? props.mapImageUrl(src, value)
          : src
        if (mappedUrl) urls.push(mappedUrl)
      }
    }
  })
  return urls
})

function openLightbox(url: string) {
  const index = allImageUrls.value.indexOf(url)
  lightboxIndex.value = Math.max(0, index)
  lightboxImages.value = allImageUrls.value
  lightboxVisible.value = true
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
  hideHeader: props.hideHeader,
  openLightbox,
  isImageZoomable: props.isImageZoomable
})
</script>

<template>
  <div
    :class="[
      'notion',
      darkMode ? 'dark-mode' : '',
      fullPage ? 'notion-full-page' : '',
      hideTitle ? 'notion-hide-title' : ''
    ]"
  >
    <NotionBlockRenderer :level="0" :zoom="null" />
    <VueEasyLightbox
      v-if="isMounted"
      :visible="lightboxVisible"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      @hide="lightboxVisible = false"
    />
  </div>
</template>
