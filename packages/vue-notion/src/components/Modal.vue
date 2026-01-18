<script lang="ts">
export default {
  name: 'NotionModal'
}
</script>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  contentLabel?: string
}>()

const emit = defineEmits(['close'])

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
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
  <Teleport to="body">
    <Transition name="notion-modal-fade">
      <div
        v-if="isOpen"
        class="notion-modal-overlay"
        @click.self="emit('close')"
      >
        <div
          class="notion-modal"
          role="dialog"
          :aria-label="contentLabel"
          aria-modal="true"
        >
          <button
            class="notion-modal-close"
            @click="emit('close')"
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" class="notion-modal-close-icon">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </svg>
          </button>

          <div class="notion-modal-content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.notion-modal-fade-enter-active,
.notion-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.notion-modal-fade-enter-from,
.notion-modal-fade-leave-to {
  opacity: 0;
}

.notion-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40px;
}

.notion-modal {
  background: var(--bg-color);
  border-radius: 4px;
  position: relative;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.notion-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--fg-color-3);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notion-modal-close:hover {
  background-color: var(--bg-color-0);
  border-radius: 4px;
}

.notion-modal-close-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.notion-modal-content {
  overflow-y: auto;
  padding: 40px;
  flex: 1;
}

.dark-mode .notion-modal {
  background: #2f3437;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
