<script setup lang="ts">
import { computed } from 'vue'
import { useNotionContext } from '../context'
import { getListNumber } from '../utils'
import Block from './Block.vue'

const props = defineProps<{
  blockId?: string
  level?: number
  zoom?: any
  wrapList?: boolean
}>()

const { recordMap } = useNotionContext()

const id = computed(() => props.blockId || Object.keys(recordMap.block)[0])
const block = computed(() => recordMap.block[id.value]?.value)

const groupedContent = computed(() => {
  if (!block.value?.content) return []

  const groups: any[] = []
  let lastGroup: any = null

  for (const childId of block.value.content) {
    const childBlock = recordMap.block[childId]?.value
    if (
      childBlock?.type === 'bulleted_list' ||
      childBlock?.type === 'numbered_list'
    ) {
      if (lastGroup && lastGroup.type === childBlock.type) {
        lastGroup.blockIds.push(childId)
      } else {
        lastGroup = {
          type: childBlock.type,
          blockIds: [childId],
          key: `group-${childId}`
        }
        groups.push(lastGroup)
      }
    } else {
      lastGroup = null
      groups.push({
        type: 'single',
        blockId: childId,
        key: childId
      })
    }
  }

  return groups
})
</script>

<template>
  <Block
    v-if="block"
    :key="id"
    :level="level || 0"
    :block="block"
    :wrapList="wrapList"
  >
    <!-- Recursive rendering for children -->
    <template v-if="block.content">
      <template v-for="item in groupedContent" :key="item.key">
        <ul
          v-if="item.type === 'bulleted_list'"
          class="notion-list notion-list-disc"
        >
          <NotionBlockRenderer
            v-for="contentBlockId in item.blockIds"
            :key="contentBlockId"
            :blockId="contentBlockId"
            :level="(level || 0) + 1"
            :wrapList="false"
          />
        </ul>
        <ol
          v-else-if="item.type === 'numbered_list'"
          class="notion-list notion-list-numbered"
          :start="getListNumber(item.blockIds[0], recordMap.block)"
        >
          <NotionBlockRenderer
            v-for="contentBlockId in item.blockIds"
            :key="contentBlockId"
            :blockId="contentBlockId"
            :level="(level || 0) + 1"
            :wrapList="false"
          />
        </ol>
        <NotionBlockRenderer
          v-else
          :blockId="item.blockId"
          :level="(level || 0) + 1"
        />
      </template>
    </template>
  </Block>
</template>
