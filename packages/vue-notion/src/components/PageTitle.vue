<script lang="ts">
export default {
  name: 'NotionPageTitle'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { getBlockTitle } from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import PageIcon from './PageIcon.vue'

const props = defineProps<{
  block: any
  defaultIcon?: string
}>()

const { recordMap } = useNotionContext()

const title = computed(() => getBlockTitle(props.block, recordMap))
</script>

<template>
  <span v-if="block" :class="cs('notion-page-title')">
    <PageIcon
      :block="block"
      :default-icon="defaultIcon"
      class="notion-page-title-icon"
    />
    <span v-if="title" class="notion-page-title-text">
      {{ title }}
    </span>
  </span>
</template>
