<script setup lang="ts">
import { NotionRenderer } from '@slogvo/vue-notion'
import { ref, computed } from 'vue'

// Import styles
import '@slogvo/vue-notion/styles.css'
import 'prismjs/themes/prism.css'
import 'katex/dist/katex.min.css'

const route = useRoute()
const pageId = computed(() => {
  const id = route.path.slice(1)
  // Default to Notion Kit Test Suite if no ID provided
  return id.length > 20 ? id : '067dd719a912471ea9a3ac10710e7fdf'
})

const {
  data: recordMap,
  pending,
  error
} = await useFetch(() => `/api/notion/${pageId.value}`)
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="recordMap">
    <NotionRenderer :recordMap="recordMap" fullPage />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
    'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
}
</style>
