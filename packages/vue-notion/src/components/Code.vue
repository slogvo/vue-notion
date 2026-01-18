<script lang="ts">
export default {
  name: 'NotionCode'
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { CodeBlock } from '@slogvo/notion-types'
import { getTextContent } from '@slogvo/notion-utils'
import Prism from 'prismjs'
import Text from './text/Text.vue'

// Import Prism components if needed
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-rust'

const props = defineProps<{
  block: CodeBlock
  defaultLanguage?: string
}>()

const code = computed(() => getTextContent(props.block.properties?.title))
const language = computed(
  () =>
    props.block.properties?.language?.[0]?.[0]?.toLowerCase() ||
    props.defaultLanguage ||
    'typescript'
)
const caption = computed(() => props.block.properties?.caption)

const codeRef = ref<HTMLElement | null>(null)

const highlight = () => {
  if (codeRef.value) {
    Prism.highlightElement(codeRef.value)
  }
}

onMounted(highlight)
watch(code, highlight)
watch(language, highlight)
</script>

<template>
  <div class="notion-code">
    <pre
      :class="`language-${language}`"
    ><code ref="codeRef" :class="`language-${language}`">{{ code }}</code></pre>
    <figcaption v-if="caption" class="notion-asset-caption">
      <Text :value="caption" :block="block" />
    </figcaption>
  </div>
</template>
