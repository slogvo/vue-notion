<script setup lang="ts">
import { computed } from 'vue'
import { useNotionContext } from '../context'
import Block from './Block.vue'

const props = defineProps<{
  blockId?: string
  level?: number
  zoom?: any
}>()

const { recordMap } = useNotionContext()

const id = computed(() => props.blockId || Object.keys(recordMap.block)[0])
const block = computed(() => recordMap.block[id.value]?.value)

// If block doesn't exist, don't render
</script>

<template>
  <Block v-if="block" :key="id" :level="level || 0" :block="block">
    <!-- Recursive rendering for children -->
    <template v-if="block.content">
      <NotionBlockRenderer
        v-for="contentBlockId in block.content"
        :key="contentBlockId"
        :blockId="contentBlockId"
        :level="(level || 0) + 1"
      />
    </template>
  </Block>
</template>
