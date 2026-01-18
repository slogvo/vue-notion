<script setup lang="ts">
import { computed, h } from 'vue'
import type { Decoration } from '@slogvo/notion-types'
import { isBrowser } from '../../utils'

const props = defineProps<{
  content: Decoration
}>()

const text = computed(() => props.content[0])
const decorators = computed(() => props.content[1] || [])

// Logic render decorators recursive or nested
// In Vue template, simpler to use render function or basic checks for simple decoration
// For complex nesting, render function is better.
// But Notion decorations are array of modifiers.

import { useNotionContext } from '../../context'
import PageIcon from '../PageIcon.vue'
import { getTextContent, uuidToId, idToUuid } from '../../utils'

const { recordMap, mapPageUrl, components } = useNotionContext()

const formattedElement = computed(() => {
  const t = text.value
  const d = decorators.value

  // Handle External Object Instance (eoi)
  const eoi = d?.find((dec: any) => dec[0] === 'eoi')
  if (eoi) {
    const blockId = eoi[1] as string
    const block =
      recordMap.block[blockId]?.value ||
      recordMap.block[uuidToId(blockId)]?.value ||
      recordMap.block[idToUuid(blockId)]?.value

    if (block && block.type === 'external_object_instance') {
      const format = block.format as any
      const url = format?.original_url || format?.uri
      const attributes = format?.attributes || []
      const titleAttr = attributes.find((a: any) => a.id === 'title')
      const title = titleAttr?.values?.[0] || url

      return h(
        'a',
        {
          class: 'notion-link notion-external-object',
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        title || 'Original Link'
      )
    }
  }

  // Handle Page Mention (p) specifically because it replaces the text content
  const pageMention = d?.find((dec: any) => dec[0] === 'p')
  if (pageMention) {
    const pageId = pageMention[1] as string
    const block =
      recordMap.block[pageId]?.value ||
      recordMap.block[uuidToId(pageId)]?.value ||
      recordMap.block[idToUuid(pageId)]?.value

    if (block) {
      const title = getTextContent(block.properties?.title) || 'Untitled'
      const href = mapPageUrl(pageId)

      return h(
        components.PageLink,
        {
          class: 'notion-link notion-page-mention',
          href: href
        },
        () => [
          h(PageIcon, { block, class: 'notion-page-mention-icon' }),
          h('span', { class: 'notion-page-mention-text' }, title)
        ]
      )
    } else {
      // Fallback for missing block
      const href = mapPageUrl(pageId)
      return h(
        components.PageLink,
        {
          class: 'notion-link notion-page-mention',
          href: href
        },
        () => [h('span', { class: 'notion-page-mention-text' }, 'Page')]
      )
    }
  }

  if (!d?.length) return t

  let element: any = t

  for (const decoration of d) {
    const type = decoration[0]
    switch (type) {
      case 'b':
        element = h('b', null, element)
        break
      case 'i':
        element = h('i', null, element)
        break
      case 's':
        element = h('s', null, element)
        break
      case 'a':
        const url = decoration[1]
        // TODO: Is this an internal link?
        if (url.startsWith('/')) {
          element = h(
            components.PageLink,
            {
              class: 'notion-link',
              href: url
            },
            element
          )
        } else {
          element = h(
            'a',
            {
              class: 'notion-link',
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer'
            },
            element
          )
        }
        break
      case 'c': // inline code
        element = h('code', { class: 'notion-inline-code' }, element)
        break
      case '_': // underline
        element = h('span', { class: 'notion-inline-underscore' }, element)
        break
      case 'h': // highlight
        const color = decoration[1]
        element = h('span', { class: `notion-${color}` }, element)
        break
    }
  }
  return element
})
</script>

<template>
  <template v-if="typeof formattedElement === 'string'">
    {{ formattedElement }}
  </template>
  <component :is="formattedElement" v-else />
</template>
