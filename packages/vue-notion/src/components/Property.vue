<script lang="ts">
export default {
  name: 'NotionProperty'
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
import Text from './text/Text.vue'
import Checkbox from './Checkbox.vue'

const props = defineProps<{
  schema: any
  data?: any
  block?: PageBlock
  collection?: Collection
  inline?: boolean
}>()

const type = computed(() => props.schema?.type)
</script>

<template>
  <span :class="cs('notion-property', `notion-property-${type}`)">
    <template v-if="!data">
      <!-- Empty property -->
    </template>

    <template v-else-if="type === 'title' || type === 'text'">
      <Text :value="data" :block="block" />
    </template>

    <template v-else-if="type === 'checkbox'">
      <Checkbox :is-checked="data?.[0]?.[0] === 'Yes'" />
    </template>

    <template v-else-if="type === 'select' || type === 'multi_select'">
      <span
        v-for="(val, index) in data?.[0]?.[0]?.split(',')"
        :key="index"
        :class="
          cs(
            'notion-property-select-item',
            `notion-item-${val.trim().toLowerCase()}`
          )
        "
      >
        {{ val.trim() }}
      </span>
    </template>

    <template v-else-if="type === 'date'">
      <!-- TODO: Format date -->
      {{ data?.[0]?.[0] }}
    </template>

    <template v-else>
      <!-- Fallback for other types -->
      <Text :value="data" :block="block" />
    </template>
  </span>
</template>
