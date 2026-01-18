<script setup lang="ts">
import { computed } from 'vue'
import type { Block, BaseContentBlock, PageBlock } from '@slogvo/notion-types'
import { useNotionContext } from '../context'
import { cs, uuidToId, getTextContent } from '../utils'
import Text from './text/Text.vue'
import PageIcon from './PageIcon.vue'
import Asset from './Asset.vue'
import NotionCode from './Code.vue'
import NotionEquation from './Equation.vue'
import NotionCollection from './Collection.vue'
import NotionTableOfContents from './TableOfContents.vue'
import NotionBookmark from './Bookmark.vue'
import NotionBreadcrumbs from './Breadcrumbs.vue'
import ExternalObjectInstance from './ExternalObjectInstance.vue'

const props = defineProps<{
  block: Block
  level: number
  className?: string
  hideBlockId?: boolean
}>()

const {
  components,
  mapPageUrl,
  mapImageUrl,
  fullPage,
  darkMode,
  recordMap,
  hideHeader
} = useNotionContext()

const blockId = computed(() =>
  props.hideBlockId
    ? 'notion-block'
    : `notion-block-${uuidToId(props.block.id)}`
)

const blockColor = computed(() => {
  return props.block.format?.block_color
    ? `notion-${props.block.format.block_color}`
    : undefined
})

const title = computed(() => props.block.properties?.title)
const isChecked = computed(
  () => props.block.properties?.checked?.[0]?.[0] === 'Yes'
)
const format = computed(() => (props.block.format || {}) as any)

// Page Cover logic
const pageCover = computed(() => {
  if (format.value?.page_cover) {
    return mapImageUrl(format.value.page_cover, props.block)
  }
  return null
})

const pageCoverObjectPosition = computed(() => {
  const coverPosition = (1 - (format.value?.page_cover_position || 0.5)) * 100
  return `center ${coverPosition}%`
})

const columnStyle = computed(() => {
  if (props.block.type === 'column' && format.value?.column_ratio) {
    return { width: `calc(${format.value.column_ratio * 100}% - 16px)` }
  }
  return {}
})

const collectionName = computed(() => {
  const collectionId = (props.block as any).collection_id
  if (collectionId && recordMap.collection[collectionId]) {
    return getTextContent(recordMap.collection[collectionId].value?.name)
  }
  return 'Untitled'
})

const blockAsBaseContent = computed(() => props.block as BaseContentBlock)
</script>

<template>
  <!-- Page -->
  <!-- Page (Level 0) or Collection View Page -->
  <main
    v-if="
      level === 0 &&
      (block.type === 'page' || block.type === 'collection_view_page')
    "
    :class="
      cs(
        // 'notion',
        // 'notion-app',
        darkMode ? 'dark-mode' : 'light-mode',
        blockId,
        className,
        format.page_full_width && 'notion-full-width',
        format.page_small_text && 'notion-small-text'
      )
    "
  >
    <div v-if="fullPage" class="notion-frame">
      <component v-if="!hideHeader" :is="components.Header" :block="block" />
      <!-- Page Cover -->
      <div v-if="pageCover" class="notion-page-cover-wrapper">
        <img
          class="notion-page-cover"
          :src="pageCover"
          alt="page cover"
          :style="{ objectPosition: pageCoverObjectPosition }"
        />
      </div>

      <div class="notion-page-scroller">
        <div
          :class="
            cs(
              'notion-page',
              pageCover ? 'notion-page-has-cover' : 'notion-page-no-cover',
              format.page_icon ? 'notion-page-has-icon' : 'notion-page-no-icon'
            )
          "
        >
          <!-- Page Icon -->
          <PageIcon v-if="format.page_icon" :block="block" :inline="false" />

          <h1 class="notion-title">
            <Text :value="title" :block="block" />
          </h1>

          <template
            v-if="
              block.type === 'collection_view_page' ||
              (block.type === 'page' && block.parent_table === 'collection')
            "
          >
            <NotionCollection :block="block as any" />
          </template>

          <template v-if="block.type !== 'collection_view_page'">
            <div class="notion-page-content">
              <slot />
            </div>
          </template>
        </div>
      </div>
    </div>
    <template v-else>
      <template
        v-if="
          block.type === 'collection_view_page' ||
          (block.type === 'page' && block.parent_table === 'collection')
        "
      >
        <NotionCollection :block="block as any" />
      </template>

      <template v-if="block.type !== 'collection_view_page'">
        <div class="notion-page-content">
          <slot />
        </div>
      </template>
    </template>
  </main>

  <!-- Nested Page (Link) -->
  <component
    :is="components.PageLink"
    v-else-if="block.type === 'page'"
    :class="cs('notion-page-link', blockColor, blockId)"
    :href="mapPageUrl(block.id)"
  >
    <PageIcon :block="block" />
    <div class="notion-page-link-text">
      <Text :value="title" :block="block" />
    </div>
  </component>

  <!-- Header Blocks -->
  <h1
    v-else-if="block.type === 'header'"
    :class="cs('notion-h', 'notion-h1', blockColor, blockId)"
  >
    <span class="notion-h-title"><Text :value="title" :block="block" /></span>
  </h1>

  <h2
    v-else-if="block.type === 'sub_header'"
    :class="cs('notion-h', 'notion-h2', blockColor, blockId)"
  >
    <span class="notion-h-title"><Text :value="title" :block="block" /></span>
  </h2>

  <h3
    v-else-if="block.type === 'sub_sub_header'"
    :class="cs('notion-h', 'notion-h3', blockColor, blockId)"
  >
    <span class="notion-h-title"><Text :value="title" :block="block" /></span>
  </h3>

  <!-- Text -->
  <div
    v-else-if="block.type === 'text'"
    :class="cs('notion-text', blockColor, blockId)"
  >
    <template v-if="title"><Text :value="title" :block="block" /></template>
    <div v-else class="notion-blank">&nbsp;</div>
    <slot />
  </div>

  <!-- Bullet List -->
  <ul
    v-else-if="block.type === 'bulleted_list'"
    :class="cs('notion-list', 'notion-list-disc', blockId)"
  >
    <li><Text :value="title" :block="block" /></li>
    <slot />
  </ul>

  <!-- Numbered List -->
  <ol
    v-else-if="block.type === 'numbered_list'"
    :class="cs('notion-list', 'notion-list-numbered', blockId)"
  >
    <li><Text :value="title" :block="block" /></li>
    <slot />
  </ol>

  <!-- ToDo (Checkbox) -->
  <div v-else-if="block.type === 'to_do'" :class="cs('notion-to-do', blockId)">
    <div class="notion-to-do-item">
      <div class="notion-to-do-checkbox">
        <input type="checkbox" :checked="isChecked" readonly />
      </div>
      <div
        :class="cs('notion-to-do-body', isChecked && 'notion-to-do-checked')"
      >
        <Text :value="title" :block="block" />
      </div>
    </div>
    <div class="notion-to-do-children"><slot /></div>
  </div>

  <!-- Toggle -->
  <details
    v-else-if="block.type === 'toggle'"
    :class="cs('notion-toggle', blockId)"
  >
    <summary><Text :value="title" :block="block" /></summary>
    <div><slot /></div>
  </details>

  <!-- Quote -->
  <blockquote
    v-else-if="block.type === 'quote'"
    :class="cs('notion-quote', blockColor, blockId)"
  >
    <div><Text :value="title" :block="block" /></div>
    <slot />
  </blockquote>

  <!-- Callout -->
  <div
    v-else-if="block.type === 'callout'"
    :class="
      cs('notion-callout', blockColor ? `${blockColor}_co` : undefined, blockId)
    "
  >
    <PageIcon :block="block" />
    <div class="notion-callout-text">
      <Text :value="title" :block="block" />
      <slot />
    </div>
  </div>

  <!-- Divider -->
  <hr v-else-if="block.type === 'divider'" :class="cs('notion-hr', blockId)" />

  <!-- Code -->
  <NotionCode v-else-if="block.type === 'code'" :block="block" />

  <!-- Breadcrumbs -->
  <NotionBreadcrumbs v-else-if="block.type === 'breadcrumb'" :block="block" />

  <!-- Bookmark -->
  <NotionBookmark v-else-if="block.type === 'bookmark'" :block="block" />

  <!-- Table Of Contents -->
  <NotionTableOfContents
    v-else-if="block.type === 'table_of_contents'"
    :block="block"
  />

  <!-- Reference / Synced Block -->
  <div
    v-else-if="
      block.type === 'transclusion_container' ||
      block.type === 'transclusion_reference'
    "
    :class="cs('notion-sync-block', blockId)"
  >
    <slot />
  </div>

  <!-- Equation -->
  <NotionEquation v-else-if="block.type === 'equation'" :block="block" />

  <!-- Assets (Image, Video, etc) -->
  <Asset
    v-else-if="
      [
        'image',
        'video',
        'embed',
        'figma',
        'typeform',
        'gist',
        'maps',
        'excalidraw',
        'codepen',
        'replit',
        'pdf'
      ].includes(block.type)
    "
    :block="blockAsBaseContent"
  >
    <template v-if="block.properties?.caption">
      <figcaption class="notion-asset-caption">
        <Text :value="block.properties.caption" :block="block" />
      </figcaption>
    </template>
  </Asset>

  <!-- Column List -->
  <div
    v-else-if="block.type === 'column_list'"
    :class="cs('notion-row', blockId)"
  >
    <slot />
  </div>

  <!-- Column -->
  <div
    v-else-if="block.type === 'column'"
    :class="cs('notion-column', blockId)"
    :style="columnStyle"
  >
    <slot />
  </div>

  <!-- Collection Views -->
  <NotionCollection
    v-else-if="
      (block.type as string) === 'collection_view' ||
      (block.type as string) === 'collection_view_page'
    "
    :block="block as any"
  />

  <!-- External Object Instance (GitHub, etc.) -->
  <ExternalObjectInstance
    v-else-if="block.type === 'external_object_instance'"
    :block="block"
    :class="blockId"
  />

  <!-- Default Fallback -->
  <div v-else :class="cs('notion-block-fallback', blockId)">
    <!-- Unknown block type: {{ block.type }} -->
  </div>
</template>
