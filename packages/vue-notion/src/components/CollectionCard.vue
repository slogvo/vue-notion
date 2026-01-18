<script lang="ts">
export default {
  name: 'NotionCollectionCard'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  PageBlock,
  Collection,
  CollectionView
} from '@slogvo/notion-types'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import LazyImage from './LazyImage.vue'
import Property from './Property.vue'

const props = defineProps<{
  block: PageBlock
  collection: Collection
  collectionView: CollectionView
  className?: string
}>()

const { recordMap, mapPageUrl, mapImageUrl, components } = useNotionContext()

const galleryFormat = computed(() => props.collectionView.format || {})
const cover = computed(
  () => galleryFormat.value.gallery_cover || { type: 'none' }
)
const coverSize = computed(
  () => galleryFormat.value.gallery_cover_size || 'medium'
)
const coverAspect = computed(
  () => galleryFormat.value.gallery_cover_aspect || 'cover'
)

const properties = computed(() => galleryFormat.value.gallery_properties || [])

const coverContent = computed(() => {
  if (cover.value.type === 'page_cover') {
    const pageCover = props.block.format?.page_cover
    if (pageCover) {
      return {
        src: mapImageUrl(pageCover, props.block),
        alt: (props.block.properties as any)?.title?.[0]?.[0] || 'notion image'
      }
    }
  }
  return null
})

const pageUrl = computed(() => mapPageUrl(props.block.id))
</script>

<template>
  <component
    :is="components.PageLink"
    :href="pageUrl"
    :class="
      cs(
        'notion-collection-card',
        `notion-collection-card-size-${coverSize}`,
        className
      )
    "
  >
    <div v-if="coverContent" class="notion-collection-card-cover">
      <LazyImage
        :src="coverContent.src"
        :alt="coverContent.alt"
        :style="{ objectFit: coverAspect }"
      />
    </div>

    <div class="notion-collection-card-body">
      <div class="notion-collection-card-property">
        <Property
          :schema="collection.schema.title"
          :data="block.properties?.title"
          :block="block"
          :collection="collection"
        />
      </div>

      <template v-for="p in properties" :key="p.property">
        <div
          v-if="
            p.visible &&
            p.property !== 'title' &&
            (block.properties as any)?.[p.property]
          "
          class="notion-collection-card-property"
        >
          <Property
            :schema="collection.schema[p.property]"
            :data="(block.properties as any)[p.property]"
            :block="block"
            :collection="collection"
            inline
          />
        </div>
      </template>
    </div>
  </component>
</template>
