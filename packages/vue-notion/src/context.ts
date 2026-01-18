import { inject, provide, type InjectionKey } from 'vue'
import type { NotionContext } from './types'

export const NotionContextKey: InjectionKey<NotionContext> =
  Symbol('NotionContext')

export function provideNotionContext(context: NotionContext) {
  provide(NotionContextKey, context)
}

export function useNotionContext() {
  const context = inject(NotionContextKey)
  if (!context) {
    throw new Error('useNotionContext must be used within a NotionRenderer')
  }
  return context
}
