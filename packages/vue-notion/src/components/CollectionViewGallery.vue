<script lang="ts">
export default {
  name: 'NotionCollectionViewGallery'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  Collection,
  CollectionView,
  CollectionQueryResult,
  PageBlock
} from '@slogvo/notion-types'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import CollectionCard from './CollectionCard.vue'
import CollectionGroup from './CollectionGroup.vue'
import { getCollectionGroups } from '../collection-utils'

const props = defineProps<{
  collection: Collection
  collectionView: CollectionView
  collectionData: CollectionQueryResult
}>()

const { recordMap } = useNotionContext()

const isGroupedCollection = computed(
  () => !!props.collectionView?.format?.collection_group_by
)

const collectionGroups = computed(() => {
  if (isGroupedCollection.value) {
    return getCollectionGroups(
      props.collection,
      props.collectionView,
      props.collectionData
    )
  }
  return []
})

const blockIds = computed(() => {
  return (
    props.collectionData.collection_group_results?.blockIds ||
    (props.collectionData as any).blockIds ||
    []
  )
})

const galleryFormat = computed(() => props.collectionView.format || {})
const galleryCoverSize = computed(
  () => galleryFormat.value.gallery_cover_size || 'medium'
)
</script>

<template>
  <template v-if="isGroupedCollection">
    <CollectionGroup
      v-for="(group, index) in collectionGroups"
      :key="index"
      v-bind="group"
    >
      <div class="notion-gallery">
        <div class="notion-gallery-view">
          <div
            :class="
              cs(
                'notion-gallery-grid',
                `notion-gallery-grid-size-${galleryCoverSize}`
              )
            "
          >
            <CollectionCard
              v-for="blockId in group.blockIds"
              :key="blockId"
              :block="recordMap.block[blockId]?.value as PageBlock"
              :collection="collection"
              :collection-view="collectionView"
            />
          </div>
        </div>
      </div>
    </CollectionGroup>
  </template>

  <div v-else class="notion-gallery">
    <div class="notion-gallery-view">
      <div
        :class="
          cs(
            'notion-gallery-grid',
            `notion-gallery-grid-size-${galleryCoverSize}`
          )
        "
      >
        <CollectionCard
          v-for="blockId in blockIds"
          :key="blockId"
          :block="recordMap.block[blockId]?.value as PageBlock"
          :collection="collection"
          :collection-view="collectionView"
        />
      </div>
    </div>
  </div>
</template>
