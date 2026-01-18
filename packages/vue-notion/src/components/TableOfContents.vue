<script lang="ts">
export default {
  name: 'NotionTableOfContents'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getPageTableOfContents,
  uuidToId,
  getBlockParentPage
} from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs } from '../utils'

const props = defineProps<{
  block: any
}>()

const { recordMap } = useNotionContext()

const toc = computed(() => {
  const page = getBlockParentPage(props.block, recordMap)
  return page ? getPageTableOfContents(page, recordMap) : []
})

const blockColor = computed(() => props.block.format?.block_color)
</script>

<template>
  <div
    v-if="toc.length"
    :class="
      cs(
        'notion-table-of-contents',
        blockColor && `notion-${blockColor}`,
        block.id
      )
    "
  >
    <a
      v-for="item in toc"
      :key="item.id"
      :href="`#${uuidToId(item.id)}`"
      :class="
        cs(
          'notion-table-of-contents-item',
          `notion-table-of-contents-item-indent-level-${item.indentLevel}`
        )
      "
    >
      <span
        class="notion-table-of-contents-item-body"
        :style="{ marginLeft: `${item.indentLevel * 24}px` }"
      >
        {{ item.text }}
      </span>
    </a>
  </div>
</template>
