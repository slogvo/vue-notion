---
name: vue-notion-development
description: Guides development of the Vue Notion renderer and its companion packages. Use when implementing new Notion blocks, utilities, or internal client logic.
---

# Vue Notion Development Skill

This skill provides guidance for developing and maintaining the Vue Notion monorepo.

## When to use this skill

- Porting components from `react-notion-x`.
- Implementing new Notion block renderers in `packages/vue-notion`.
- Updating the Notion API client in `packages/notion-client`.
- Refining universal types in `packages/notion-types`.
- Adding helper functions to `packages/notion-utils`.

## Porting Guidance (React to Vue)

### Component Logic

- **State**: Replace `useState` with `ref` or `reactive`.
- **Side Effects**: Replace `useEffect` with `onMounted`, `watch`, or `watchEffect`.
- **Context**: Replace `useContext` with `provide` / `inject`.
- **Memoization**: Replace `useMemo` with `computed`.
- **Callbacks**: Replace `useCallback` with standard functions (Vue handles reactivity automatically).

### Template Conversion

- Replace JSX with Vue templates.
- Use `v-if` / `v-else` instead of logical AND (`&&`) or ternary operators in JSX.
- Use `v-for` instead of `map()`.
- Use `v-bind` or `:` for attributes.
- Use `@` or `v-on` for event listeners.

## Block Renderer Standards

### Scoped Styles

All block-specific styles should be scoped within the Vue component to prevent leakage.

```vue
<template>
  <div class="notion-block notion-custom-block">
    <slot />
  </div>
</template>

<style scoped>
.notion-custom-block {
  /* styles here */
}
</style>
```

### Dynamic Rendering

Use the `NotionBlock` registry or `component :is` to allow users to override specific block renderers.

## Pre-flight Checklist

Before considering a change complete:

1. **Build**: Ensure all packages build successfully with `pnpm build`.
2. **Lint**: Run `pnpm test:lint`.
3. **Types**: Run `pnpm test:typecheck`.
4. **Tests**: Run `pnpm test` and ensure no regressions in rendering output.
