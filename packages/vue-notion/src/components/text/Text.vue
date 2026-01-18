<script setup lang="ts">
import { computed } from 'vue'
import type { Decoration } from '@slogvo/notion-types'
import TextDecorator from './TextDecorator.vue'

const props = defineProps<{
  value?: Decoration[]
  block?: any
}>()
</script>

<template>
  <span v-if="value" class="notion-text">
    <TextDecorator
      v-for="(decoration, index) in value"
      :key="index"
      :content="decoration"
    />
  </span>
</template>
