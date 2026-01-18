<script lang="ts">
export default {
  name: 'NotionSearchDialog'
}
</script>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getBlockParentPage, getBlockTitle } from '@slogvo/notion-utils'
import { useNotionContext } from '../context'
import { cs } from '../utils'
import PageTitle from './PageTitle.vue'

const props = defineProps<{
  isOpen: boolean
  rootBlockId: string
}>()

const emit = defineEmits(['close'])

const { components, searchNotion, mapPageUrl, defaultPageIcon } =
  useNotionContext()

const isLoading = ref(false)
const query = ref('')
const searchResult = ref<any>(null)
const searchError = ref<any>(null)
const inputRef = ref<HTMLInputElement | null>(null)

let throttleTimer: any = null

function throttle(fn: Function, delay: number) {
  return (...args: any[]) => {
    if (throttleTimer) return
    throttleTimer = setTimeout(() => {
      fn(...args)
      throttleTimer = null
    }, delay)
  }
}

async function searchImpl() {
  if (!query.value.trim() || !searchNotion) {
    isLoading.value = false
    searchResult.value = null
    searchError.value = null
    return
  }

  isLoading.value = true
  try {
    const result = await searchNotion({
      query: query.value,
      ancestorId: props.rootBlockId
    })

    if (result.error || result.errorId) {
      searchError.value = result
      searchResult.value = null
    } else {
      const results = result.results
        .map((res: any) => {
          const block = result.recordMap.block[res.id]?.value
          if (!block) return

          const title = getBlockTitle(block, result.recordMap)
          if (!title) return

          res.title = title
          res.block = block
          res.recordMap = result.recordMap
          res.page =
            getBlockParentPage(block, result.recordMap, { inclusive: true }) ||
            block

          if (!res.page.id) return

          if (res.highlight?.text) {
            res.highlight.html = res.highlight.text
              .replaceAll(/<gzknfouu>/gi, '<b>')
              .replaceAll(/<\/gzknfouu>/gi, '</b>')
          }

          return res
        })
        .filter(Boolean)

      // Dedupe by page id
      const resultMap = Object.fromEntries(
        results.map((res: any) => [res.page.id, res])
      )
      searchResult.value = {
        ...result,
        results: Object.values(resultMap)
      }
      searchError.value = null
    }
  } catch (err) {
    searchError.value = err
    searchResult.value = null
  } finally {
    isLoading.value = false
  }
}

const throttledSearch = throttle(searchImpl, 1000)

watch(query, newQuery => {
  if (!newQuery.trim()) {
    searchResult.value = null
    searchError.value = null
    isLoading.value = false
    return
  }
  throttledSearch()
})

onMounted(async () => {
  if (searchNotion) {
    // Warmup
    await searchNotion({
      query: '',
      ancestorId: props.rootBlockId
    })
  }
})

function onClearQuery() {
  query.value = ''
}
</script>

<template>
  <component
    :is="components.Modal"
    :is-open="isOpen"
    content-label="Search"
    @close="emit('close')"
  >
    <div class="quickFindMenu">
      <div class="searchBar">
        <div class="inlineIcon">
          <svg v-if="isLoading" class="loadingIcon" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              stroke-width="10"
              fill="none"
              stroke-dasharray="282.7"
              stroke-dashoffset="210"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <svg v-else class="searchIcon" viewBox="0 0 24 24">
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </div>

        <input
          ref="inputRef"
          v-model="query"
          class="searchInput"
          placeholder="Search"
          @keydown.stop
        />

        <div
          v-if="query"
          role="button"
          class="clearButton"
          @click="onClearQuery"
        >
          <svg class="clearIcon" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </div>
      </div>

      <div v-if="query.trim() && searchResult" class="resultsPane">
        <template v-if="searchResult.results.length">
          <component
            :is="components.PageLink"
            v-for="result in searchResult.results"
            :key="result.id"
            :href="mapPageUrl(result.page.id)"
            class="result notion-page-link"
            @click="emit('close')"
          >
            <PageTitle :block="result.page" :default-icon="defaultPageIcon" />

            <div
              v-if="result.highlight?.html"
              class="notion-search-result-highlight"
              v-html="result.highlight.html"
            />
          </component>

          <footer class="resultsFooter">
            <div>
              <span class="resultsCount">{{
                searchResult.results.length
              }}</span>
              {{ searchResult.results.length === 1 ? ' result' : ' results' }}
            </div>
          </footer>
        </template>

        <div v-else class="noResultsPane">
          <div class="noResults">No results</div>
          <div class="noResultsDetail">Try different search terms</div>
        </div>
      </div>

      <div v-else-if="query.trim() && searchError" class="noResultsPane">
        <div class="noResults">Search error</div>
      </div>
    </div>
  </component>
</template>
