<script lang="ts">
export default {
  name: 'NotionHeader'
}
</script>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { getPageBreadcrumbs } from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import PageIcon from './PageIcon.vue'
import SearchDialog from './SearchDialog.vue'

const props = defineProps<{
  block: any
}>()

const { recordMap, components, mapPageUrl, searchNotion } = useNotionContext()

const breadcrumbs = computed(() => {
  return getPageBreadcrumbs(recordMap, props.block.id)
})

const isSearchOpen = ref(false)

function onOpenSearch() {
  isSearchOpen.value = true
}

function onCloseSearch() {
  isSearchOpen.value = false
}

function handleKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'k')) {
    e.preventDefault()
    onOpenSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <header class="notion-header">
    <div class="notion-nav-header">
      <div v-if="breadcrumbs" class="breadcrumbs">
        <template
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="breadcrumb.pageId"
        >
          <component
            :is="breadcrumb.active ? 'div' : components.PageLink"
            v-bind="
              breadcrumb.active ? {} : { href: mapPageUrl(breadcrumb.pageId) }
            "
            :class="cs('breadcrumb', breadcrumb.active && 'active')"
          >
            <PageIcon
              v-if="breadcrumb.icon"
              :block="breadcrumb.block"
              class="icon"
            />

            <span v-if="breadcrumb.title" class="title">
              {{ breadcrumb.title }}
            </span>
          </component>

          <span v-if="index < breadcrumbs.length - 1" class="spacer"> / </span>
        </template>
      </div>

      <div class="notion-nav-header-right">
        <div
          v-if="searchNotion"
          role="button"
          class="notion-nav-button notion-search-button"
          @click="onOpenSearch"
        >
          <svg
            aria-hidden="true"
            role="graphics-symbol"
            viewBox="0 0 20 20"
            class="searchIcon"
            style="
              width: 22px;
              height: 22px;
              display: block;
              fill: inherit;
              flex-shrink: 0;
              color: inherit;
            "
          >
            <path
              d="M8.875 2.625a6.25 6.25 0 1 0 3.955 11.09l3.983 3.982a.625.625 0 1 0 .884-.884l-3.983-3.982a6.25 6.25 0 0 0-4.84-10.205m-5 6.25a5 5 0 1 1 10 0 5 5 0 0 1-10 0"
            ></path>
          </svg>
        </div>
        <!-- Slot for other header actions (Share, Menu, Custom CTA) -->
        <slot name="header-right" />
      </div>

      <SearchDialog
        v-if="isSearchOpen"
        :is-open="isSearchOpen"
        :root-block-id="block.id"
        @close="onCloseSearch"
      />
    </div>
  </header>
</template>
