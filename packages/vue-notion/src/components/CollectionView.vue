<script lang="ts">
export default {
  name: 'NotionCollectionView'
}
</script>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type {
  Collection,
  CollectionView,
  CollectionQueryResult
} from '@slogvo/notion-types'

const props = defineProps<{
  collection: Collection
  collectionView: CollectionView
  collectionData: CollectionQueryResult
  width?: number
  padding?: number
}>()

// Lazy load specific view components
const CollectionViewGallery = defineAsyncComponent(
  () => import('./CollectionViewGallery.vue')
)
const CollectionViewList = defineAsyncComponent(
  () => import('./CollectionViewList.vue')
)
const CollectionViewTable = defineAsyncComponent(
  () => import('./CollectionViewTable.vue')
)
const CollectionViewBoard = defineAsyncComponent(
  () => import('./CollectionViewBoard.vue')
)
</script>

<template>
  <div class="notion-collection-view">
    <CollectionViewGallery
      v-if="collectionView.type === 'gallery'"
      :collection="collection"
      :collection-view="collectionView"
      :collection-data="collectionData"
      :width="width"
      :padding="padding"
    />
    <CollectionViewList
      v-else-if="collectionView.type === 'list'"
      :collection="collection"
      :collection-view="collectionView"
      :collection-data="collectionData"
      :width="width"
      :padding="padding"
    />
    <CollectionViewTable
      v-else-if="collectionView.type === 'table'"
      :collection="collection"
      :collection-view="collectionView"
      :collection-data="collectionData"
      :width="width"
      :padding="padding"
    />
    <CollectionViewBoard
      v-else-if="collectionView.type === 'board'"
      :collection="collection"
      :collection-view="collectionView"
      :collection-data="collectionData"
      :width="width"
      :padding="padding"
    />
    <div v-else class="notion-collection-view-fallback">
      Unsupported collection view: {{ collectionView.type }}
    </div>
  </div>
</template>
