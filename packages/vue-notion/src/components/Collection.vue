<script lang="ts">
export default {
  name: 'NotionCollection'
}
</script>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type {
  CollectionViewBlock,
  CollectionViewPageBlock,
  PageBlock,
  CollectionView
} from '@slogvo/notion-types'
import {
  getBlockCollectionId,
  getBlockParentPage,
  getTextContent
} from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import PageIcon from './PageIcon.vue'
import CollectionViewRenderer from './CollectionView.vue'

const props = defineProps<{
  block: CollectionViewBlock | CollectionViewPageBlock | PageBlock
  className?: string
}>()

const { recordMap } = useNotionContext()

const collectionId = computed(() =>
  getBlockCollectionId(props.block, recordMap)
)
const collection = computed(() =>
  collectionId.value ? recordMap.collection[collectionId.value]?.value : null
)

const viewIds = computed(() => (props.block as any).view_ids || [])
const activeViewId = ref(viewIds.value[0])

const collectionView = computed(() =>
  activeViewId.value
    ? recordMap.collection_view[activeViewId.value]?.value
    : null
)
const collectionData = computed(() => {
  if (!collectionId.value || !activeViewId.value) return null
  return recordMap.collection_query[collectionId.value]?.[activeViewId.value]
})

const title = computed(() =>
  collection.value ? getTextContent(collection.value.name).trim() : ''
)
const showTitle = computed(
  () =>
    collectionView.value?.format?.hide_linked_collection_name !== true &&
    title.value
)

const windowWidth = ref(
  typeof window !== 'undefined' ? window.innerWidth : 1024
)

const onResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const layout = computed(() => {
  const parentPage = getBlockParentPage(props.block, recordMap)
  const isFullWidth = parentPage?.format?.page_full_width === true

  if (
    collectionView.value?.type !== 'table' &&
    collectionView.value?.type !== 'board'
  ) {
    return { width: 0, padding: 0 }
  }

  const width = windowWidth.value
  const maxNotionBodyWidth = 708
  let notionBodyWidth = maxNotionBodyWidth

  if (isFullWidth) {
    notionBodyWidth = Math.trunc(width - 2 * Math.min(96, width * 0.08))
  } else {
    notionBodyWidth =
      width < maxNotionBodyWidth
        ? Math.trunc(width - width * 0.02)
        : maxNotionBodyWidth
  }

  const padding = Math.max(0, Math.trunc((width - notionBodyWidth) / 2))

  return { width, padding }
})

const onChangeView = (viewId: string) => {
  activeViewId.value = viewId
}
</script>

<template>
  <div
    v-if="collection && collectionView && collectionData"
    :class="cs('notion-collection-wrapper', className)"
  >
    <!-- Tabs for multiple views -->
    <div v-if="viewIds.length > 1" class="notion-collection-view-tabs-row">
      <button
        v-for="viewId in viewIds"
        :key="viewId"
        @click="onChangeView(viewId)"
        :class="
          cs(
            'notion-collection-view-tabs-content-item',
            activeViewId === viewId &&
              'notion-collection-view-tabs-content-item-active'
          )
        "
      >
        <span class="notion-collection-view-type-title">
          {{
            recordMap.collection_view[viewId]?.value?.name ||
            recordMap.collection_view[viewId]?.value?.type
          }}
        </span>
      </button>
    </div>

    <!-- Collection Header -->
    <div v-if="showTitle" class="notion-collection-header">
      <div class="notion-collection-header-title">
        <PageIcon
          v-if="collection.icon"
          :block="block"
          class="notion-page-title-icon"
          hide-default-icon
        />
        {{ title }}
      </div>
    </div>

    <!-- Collection View -->
    <div :class="cs('notion-collection', className)">
      <CollectionViewRenderer
        :collection="collection"
        :collectionView="collectionView"
        :collectionData="collectionData"
        :width="layout.width"
        :padding="layout.padding"
      />
    </div>
  </div>
</template>
