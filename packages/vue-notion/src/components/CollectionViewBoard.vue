<script lang="ts">
export default {
  name: 'NotionCollectionViewBoard'
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
import Property from './Property.vue'
import CollectionGroup from './CollectionGroup.vue'
import { getCollectionGroups } from '../collection-utils'

const props = defineProps<{
  collection: Collection
  collectionView: CollectionView
  collectionData: CollectionQueryResult
  width?: number
  padding?: number
}>()

const boardStyle = computed(() => ({
  paddingLeft: props.padding ? `${props.padding}px` : '0'
}))

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

const boardFormat = computed(() => props.collectionView.format || {})
const boardCoverSize = computed(
  () => boardFormat.value.board_cover_size || 'medium'
)

const boardGroups = computed(() => {
  return (
    boardFormat.value.board_columns || boardFormat.value.board_groups2 || []
  )
})

const getGroupResults = (p: any) => {
  const groupKey = `results:${p?.value?.type}:${p?.value?.value || 'uncategorized'}`
  return (props.collectionData as any)[groupKey] || { blockIds: [] }
}

const getGroupCount = (p: any) => {
  const results = getGroupResults(p)
  return results.total || results.blockIds?.length || 0
}

const groupSummaryStyle = computed(() => ({
  paddingLeft: props.padding ? `${props.padding}px` : '0'
}))
</script>

<template>
  <template v-if="isGroupedCollection">
    <CollectionGroup
      v-for="(group, index) in collectionGroups"
      :key="index"
      v-bind="group"
      :summary-props="{ style: groupSummaryStyle }"
    >
      <div class="notion-board">
        <div
          :class="
            cs('notion-board-view', `notion-board-view-size-${boardCoverSize}`)
          "
          :style="boardStyle"
        >
          <div class="notion-board-header">
            <div class="notion-board-header-inner">
              <div
                v-for="(p, i) in boardGroups"
                :key="i"
                class="notion-board-th"
              >
                <div v-if="!p.hidden" class="notion-board-th-body">
                  <span class="notion-board-th-title">
                    {{ p.value?.value || 'No Select' }}
                  </span>
                  <span class="notion-board-th-count">
                    {{ getGroupCount(p) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="notion-board-header-placeholder" />

          <div class="notion-board-body">
            <div
              v-for="(p, i) in boardGroups"
              :key="i"
              class="notion-board-group"
            >
              <template v-if="!p.hidden">
                <CollectionCard
                  v-for="blockId in getGroupResults(p).blockIds"
                  :key="blockId"
                  :block="recordMap.block[blockId]?.value as PageBlock"
                  :collection="collection"
                  :collection-view="collectionView"
                  class="notion-board-group-card"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </CollectionGroup>
  </template>

  <div v-else class="notion-board">
    <div
      :class="
        cs('notion-board-view', `notion-board-view-size-${boardCoverSize}`)
      "
      :style="boardStyle"
    >
      <div class="notion-board-header">
        <div class="notion-board-header-inner">
          <div
            v-for="(p, index) in boardGroups"
            :key="index"
            class="notion-board-th"
          >
            <div v-if="!p.hidden" class="notion-board-th-body">
              <span class="notion-board-th-title">
                {{ p.value?.value || 'No Select' }}
              </span>
              <span class="notion-board-th-count">
                {{ getGroupCount(p) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="notion-board-header-placeholder" />

      <div class="notion-board-body">
        <div
          v-for="(p, index) in boardGroups"
          :key="index"
          class="notion-board-group"
        >
          <template v-if="!p.hidden">
            <template
              v-for="blockId in getGroupResults(p).blockIds"
              :key="blockId"
            >
              <CollectionCard
                v-if="recordMap.block[blockId]?.value"
                :block="recordMap.block[blockId].value as PageBlock"
                :collection="collection"
                :collection-view="collectionView"
                class="notion-board-group-card"
              />
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
