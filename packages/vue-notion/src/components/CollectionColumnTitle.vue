<script lang="ts">
export default {
  name: 'NotionCollectionColumnTitle'
}
</script>

<script setup lang="ts">
import type { CollectionPropertySchema } from '@slogvo/notion-types'

const props = defineProps<{
  schema: CollectionPropertySchema
}>()
</script>

<template>
  <div class="notion-collection-column-title">
    <!-- Icon placeholder based on type -->
    <span class="notion-collection-column-title-icon">
      <!-- TODO: Add proper icons for different property types -->
    </span>
    <span class="notion-collection-column-title-body">
      {{ schema.name }}
    </span>
  </div>
</template>
