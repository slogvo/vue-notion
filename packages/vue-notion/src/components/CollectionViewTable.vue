<script lang="ts">
export default {
  name: 'NotionCollectionViewTable'
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
import Property from './Property.vue'
import CollectionColumnTitle from './CollectionColumnTitle.vue'
import CollectionGroup from './CollectionGroup.vue'
import { getCollectionGroups } from '../collection-utils'

const props = defineProps<{
  collection: Collection
  collectionView: CollectionView
  collectionData: CollectionQueryResult
  width?: number
  padding?: number
}>()

const { recordMap } = useNotionContext()

const tableStyle = computed(() => ({
  width: props.width ? `${props.width}px` : '100%',
  maxWidth: props.width ? `${props.width}px` : '100%'
}))

const tableViewStyle = computed(() => ({
  paddingLeft: props.padding ? `${props.padding}px` : '0',
  paddingRight: props.padding ? `${props.padding}px` : '0'
}))

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

const properties = computed(() => {
  if (props.collectionView.format?.table_properties) {
    return props.collectionView.format.table_properties.filter(
      (p: any) => p.visible && props.collection.schema[p.property]
    )
  } else {
    return [{ property: 'title' }].concat(
      Object.keys(props.collection.schema)
        .filter(p => p !== 'title')
        .map(property => ({ property }))
    )
  }
})

function getCellStyle(p: any) {
  const style: any = {}
  if (p.width) {
    style.width = `${p.width}px`
  } else if (p.property === 'title') {
    style.width = '280px'
  } else {
    style.width = '200px'
  }
  return style
}
const groupSummaryStyle = computed(() => ({
  paddingLeft: props.padding ? `${props.padding}px` : '0',
  paddingRight: props.padding ? `${props.padding}px` : '0'
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
      <div class="notion-table" :style="tableStyle">
        <div class="notion-table-view" :style="tableViewStyle">
          <div v-if="properties.length" class="notion-table-header">
            <div class="notion-table-header-inner">
              <div
                v-for="p in properties"
                :key="p.property"
                class="notion-table-th"
              >
                <div
                  class="notion-table-view-header-cell"
                  :style="getCellStyle(p)"
                >
                  <div class="notion-table-view-header-cell-inner">
                    <CollectionColumnTitle
                      :schema="collection.schema[p.property]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="notion-table-body">
            <div
              v-for="blockId in group.blockIds"
              :key="blockId"
              class="notion-table-row"
            >
              <div
                v-for="p in properties"
                :key="p.property"
                :class="
                  cs(
                    'notion-table-cell',
                    `notion-table-cell-${collection.schema[p.property]?.type}`
                  )
                "
                :style="getCellStyle(p)"
              >
                <Property
                  :schema="collection.schema[p.property]"
                  :data="
                    (recordMap.block[blockId]?.value as PageBlock)
                      ?.properties?.[
                      p.property as keyof PageBlock['properties']
                    ]
                  "
                  :block="recordMap.block[blockId]?.value as PageBlock"
                  :collection="collection"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollectionGroup>
  </template>

  <div v-else class="notion-table" :style="tableStyle">
    <div class="notion-table-view" :style="tableViewStyle">
      <div v-if="properties.length" class="notion-table-header">
        <div class="notion-table-header-inner">
          <div
            v-for="p in properties"
            :key="p.property"
            class="notion-table-th"
          >
            <div class="notion-table-view-header-cell" :style="getCellStyle(p)">
              <div class="notion-table-view-header-cell-inner">
                <CollectionColumnTitle
                  :schema="collection.schema[p.property]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="notion-table-body">
        <div
          v-for="blockId in blockIds"
          :key="blockId"
          class="notion-table-row"
        >
          <div
            v-for="p in properties"
            :key="p.property"
            :class="
              cs(
                'notion-table-cell',
                `notion-table-cell-${collection.schema[p.property]?.type}`
              )
            "
            :style="getCellStyle(p)"
          >
            <Property
              :schema="collection.schema[p.property]"
              :data="
                (recordMap.block[blockId]?.value as PageBlock)?.properties?.[
                  p.property as keyof PageBlock['properties']
                ]
              "
              :block="recordMap.block[blockId]?.value as PageBlock"
              :collection="collection"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
