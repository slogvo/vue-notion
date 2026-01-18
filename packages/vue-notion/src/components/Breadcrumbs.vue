<script lang="ts">
export default {
  name: 'NotionBreadcrumbs'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { getPageBreadcrumbs } from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import PageIcon from './PageIcon.vue'
import Text from './text/Text.vue'

const props = defineProps<{
  block: any
}>()

const { recordMap, components, mapPageUrl } = useNotionContext()

const breadcrumbs = computed(() => {
  return getPageBreadcrumbs(recordMap, props.block.id)
})
</script>

<template>
  <div v-if="breadcrumbs" class="notion-breadcrumbs">
    <template
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="breadcrumb.pageId"
    >
      <component
        :is="components.PageLink"
        :href="mapPageUrl(breadcrumb.pageId)"
        class="notion-breadcrumb"
      >
        <PageIcon
          v-if="breadcrumb.icon"
          :block="breadcrumb.block"
          class="notion-breadcrumb-icon"
        />

        <span v-if="breadcrumb.title" class="notion-breadcrumb-title">
          {{ breadcrumb.title }}
        </span>
      </component>

      <div v-if="index < breadcrumbs.length - 1" class="notion-spacer">/</div>
    </template>
  </div>
</template>
