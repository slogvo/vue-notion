<script setup lang="ts">
defineProps<{
  href: string
  className?: string
}>()
</script>

<template>
  <a :href="href" :class="className">
    <slot />
  </a>
</template>
