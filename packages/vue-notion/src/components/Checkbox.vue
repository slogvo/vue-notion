<script lang="ts">
export default {
  name: 'NotionCheckbox'
}
</script>

<script setup lang="ts">
const props = defineProps<{
  isChecked: boolean
}>()
</script>

<template>
  <span :class="['notion-checkbox', isChecked && 'notion-checkbox-checked']">
    <svg v-if="isChecked" viewBox="0 0 14 14" class="notion-checkbox-check">
      <polyline points="3.3 7 5.7 9 10.7 4" />
    </svg>
  </span>
</template>
