<script lang="ts">
export default {
  name: 'NotionCollectionGroup'
}
</script>

<script setup lang="ts">
import { useNotionContext } from '../context'
import Property from './Property.vue'

const props = defineProps<{
  collection: any
  collectionGroup: any
  schema: any
  value: any
  hidden?: boolean
  summaryProps?: any
  detailsProps?: any
}>()

const { components } = useNotionContext()
</script>

<template>
  <details
    v-if="!hidden"
    open
    class="notion-collection-group"
    v-bind="detailsProps"
  >
    <summary class="notion-collection-group-title" v-bind="summaryProps">
      <div>
        <Property :schema="schema" :data="[[value]]" :collection="collection" />
        <span class="notion-board-th-count">
          {{ collectionGroup?.total }}
        </span>
      </div>
    </summary>

    <slot />
  </details>
</template>
