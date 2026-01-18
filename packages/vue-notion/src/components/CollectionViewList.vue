<script lang="ts">
export default {
  name: 'NotionCollectionViewList'
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
import PageIcon from './PageIcon.vue'
import Property from './Property.vue'
import CollectionGroup from './CollectionGroup.vue'
import { getCollectionGroups } from '../collection-utils'

const props = defineProps<{
  collection: Collection
  collectionView: CollectionView
  collectionData: CollectionQueryResult
}>()

const { recordMap, mapPageUrl, components } = useNotionContext()

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

const listProperties = computed(() => {
  return (
    props.collectionView.format?.list_properties?.filter(
      (p: any) => p.visible
    ) || []
  )
})
</script>

<template>
  <template v-if="isGroupedCollection">
    <CollectionGroup
      v-for="(group, index) in collectionGroups"
      :key="index"
      v-bind="group"
    >
      <div class="notion-list-collection">
        <div class="notion-list-view">
          <div class="notion-list-body">
            <component
              :is="components.PageLink"
              v-for="blockId in group.blockIds"
              :key="blockId"
              :href="mapPageUrl(blockId)"
              class="notion-list-item notion-page-link"
            >
              <div class="notion-list-item-title">
                <PageIcon
                  :block="recordMap.block[blockId]?.value as PageBlock"
                  class="notion-page-title-icon"
                  hide-default-icon
                />
                <Property
                  :schema="collection.schema.title"
                  :data="
                    (recordMap.block[blockId]?.value as PageBlock)?.properties
                      ?.title
                  "
                  :block="recordMap.block[blockId]?.value as PageBlock"
                  :collection="collection"
                />
              </div>

              <div class="notion-list-item-body">
                <template v-for="p in listProperties" :key="p.property">
                  <div
                    v-if="p.property !== 'title'"
                    class="notion-list-item-property"
                  >
                    <Property
                      :schema="collection.schema[p.property]"
                      :data="
                        (
                          (recordMap.block[blockId]?.value as PageBlock)
                            ?.properties as any
                        )?.[p.property]
                      "
                      :block="recordMap.block[blockId]?.value as PageBlock"
                      :collection="collection"
                    />
                  </div>
                </template>
              </div>
            </component>
          </div>
        </div>
      </div>
    </CollectionGroup>
  </template>

  <div v-else class="notion-list-collection">
    <div class="notion-list-view">
      <div class="notion-list-body">
        <component
          :is="components.PageLink"
          v-for="blockId in blockIds"
          :key="blockId"
          :href="mapPageUrl(blockId)"
          class="notion-list-item notion-page-link"
        >
          <div class="notion-list-item-title">
            <PageIcon
              :block="recordMap.block[blockId]?.value as PageBlock"
              class="notion-page-title-icon"
              hide-default-icon
            />
            <Property
              :schema="collection.schema.title"
              :data="
                (recordMap.block[blockId]?.value as PageBlock)?.properties
                  ?.title
              "
              :block="recordMap.block[blockId]?.value as PageBlock"
              :collection="collection"
            />
          </div>

          <div class="notion-list-item-body">
            <template v-for="p in listProperties" :key="p.property">
              <div
                v-if="p.property !== 'title'"
                class="notion-list-item-property"
              >
                <Property
                  :schema="collection.schema[p.property]"
                  :data="
                    (
                      (recordMap.block[blockId]?.value as PageBlock)
                        ?.properties as any
                    )?.[p.property]
                  "
                  :block="recordMap.block[blockId]?.value as PageBlock"
                  :collection="collection"
                />
              </div>
            </template>
          </div>
        </component>
      </div>
    </div>
  </div>
</template>
