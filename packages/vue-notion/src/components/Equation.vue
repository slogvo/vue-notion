<script lang="ts">
export default {
  name: 'NotionEquation'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'
import { getTextContent } from '@slogvo/notion-utils'

const props = defineProps<{
  block: any
  inline?: boolean
}>()

const math = computed(() => getTextContent(props.block.properties?.title))

const html = computed(() => {
  const content = math.value
  if (!content) return ''
  try {
    return katex.renderToString(content, {
      throwOnError: false,
      displayMode: !props.inline
    })
  } catch (err) {
    console.error('KaTeX error', err)
    return content
  }
})
</script>

<template>
  <span
    v-if="inline"
    class="notion-equation notion-equation-inline"
    v-html="html"
  />
  <div v-else class="notion-equation notion-equation-block" v-html="html" />
</template>
