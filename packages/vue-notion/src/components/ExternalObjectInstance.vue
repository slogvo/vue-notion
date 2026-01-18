<script setup lang="ts">
import { computed } from 'vue'
import type { Block } from '@slogvo/notion-types'
import { useNotionContext } from '../context'
import { cs, formatNotionDateTime } from '../utils'

const props = defineProps<{
  block: Block
  inline?: boolean
  className?: string
}>()

const { components } = useNotionContext()

const format = computed(() => props.block?.format || {})
const originalUrl = computed(() => format.value.original_url)
const attributes = computed(() => format.value.attributes || [])
const domain = computed(() => format.value.domain)

const title = computed(() => {
  const attr = attributes.value.find((attr: any) => attr.id === 'title')
  return attr?.values[0] || ''
})

const owner = computed(() => {
  const attr = attributes.value.find((attr: any) => attr.id === 'owner')
  let ownerValue = attr?.values[0] || ''

  // For GitHub, extract just the username/org
  if (domain.value === 'github.com' && ownerValue) {
    const parts = ownerValue.split('/')
    ownerValue = parts.at(-1) || ownerValue
  }

  return ownerValue
})

const lastUpdatedAt = computed(() => {
  const attr = attributes.value.find((attr: any) => attr.id === 'updated_at')
  return attr?.values[0]
})

const lastUpdated = computed(() => {
  return lastUpdatedAt.value ? formatNotionDateTime(lastUpdatedAt.value) : null
})

const isSupported = computed(() => {
  // Currently only GitHub is supported
  return domain.value === 'github.com'
})

const externalIcon = computed(() => {
  switch (domain.value) {
    case 'github.com':
      return 'github'
    default:
      return null
  }
})

// Validate required data
const isValid = computed(() => {
  return originalUrl.value && attributes.value.length > 0
})
</script>

<template>
  <component
    v-if="isValid && isSupported"
    :is="components.PageLink"
    target="_blank"
    rel="noopener noreferrer"
    :href="originalUrl"
    :class="
      cs(
        'notion-external',
        inline ? 'notion-external-mention' : 'notion-external-block notion-row',
        className
      )
    "
  >
    <!-- External Icon/Image -->
    <div v-if="externalIcon" class="notion-external-image">
      <svg v-if="externalIcon === 'github'" viewBox="0 0 24 24" fill="#24292e">
        <path
          d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
        />
      </svg>
    </div>

    <!-- External Description -->
    <div class="notion-external-description">
      <div class="notion-external-title">{{ title }}</div>

      <!-- Block view (not inline) -->
      <div
        v-if="!inline && (owner || lastUpdated)"
        class="notion-external-block-desc"
      >
        <span v-if="owner">{{ owner }}</span>
        <span v-if="owner && lastUpdated"> • </span>
        <span v-if="lastUpdated">Updated {{ lastUpdated }}</span>
      </div>

      <!-- Inline view would show MentionPreviewCard on hover -->
      <!-- For simplicity, we skip the preview card for now -->
    </div>
  </component>

  <!-- Fallback for unsupported or invalid blocks -->
  <div v-else style="color: #999; font-style: italic; padding: 8px">
    [Unsupported external integration: {{ domain || 'unknown' }}]
  </div>
</template>
