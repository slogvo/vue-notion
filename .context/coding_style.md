# Coding Standards: Vue Notion

## 1. Vue Components

### Script Setup (MANDATORY)

- **ALWAYS use**: `<script setup lang="ts">` for SFCs.
- **NEVER use**: Options API.

### Component Structure

```vue
<script setup lang="ts">
// 1. Imports (standard library, then workspace, then relative)
// 2. Props/Emits definitions using defineProps and defineEmits
// 3. Composables
// 4. Reactive state (ref, reactive)
// 5. Computed properties
// 6. Methods
// 7. Lifecycle hooks (onMounted, etc.)
</script>

<template>
  <!-- Notion-specific semantic HTML -->
</template>

<style scoped>
/* Scoped styles to ensure encapsulation */
</style>
```

### Component Logic

- Port logic from `react-notion-x` carefully.
- Use `computed` for any data derivation based on props.
- Use `v-bind` for dynamic classes and styles.
- Support slots for customization where appropriate.

## 2. TypeScript Standards

### Type Hints (MANDATORY)

- ALL functions MUST have explicit return types.
- ALL parameters MUST be typed.
- Leverage types from `notion-types`.

```typescript
// ✅ Good
function getBlockTitle(block: Block): string { ... }

// ❌ Bad
function getBlockTitle(block) { ... }
```

### Type Definitions

- Core types reside in `packages/notion-types`.
- Component-specific types can be colocated or in a `types.ts` file within the package.

## 3. Package Architecture

### Monorepo Patterns

- `vue-notion` depends on `notion-types`, `notion-utils`, and `notion-client`.
- Ensure all workspace dependencies are correctly tracked in `package.json` using `workspace:*`.

### Logic Separation

- Move generic Notion processing logic to `notion-utils`.
- Move API interaction logic to `notion-client`.
- Keep `vue-notion` focused purely on rendering.

## 4. Styling

- Use scoped CSS in Vue components.
- Maintain consistency with Notion's default styling.
- Allow users to override styles via global CSS or scoped classes.

## 5. Checklist: Before Committing

**🚨 BEFORE considering code "done", you MUST:**

1. [ ] **Types**: Run `pnpm test:typecheck` - no errors
2. [ ] **Lint**: Run `pnpm test:lint` - no errors
3. [ ] **Format**: Run `pnpm test:format` - no errors
4. [ ] **Test**: Run `pnpm test` - all tests pass
5. [ ] **Build**: Run `pnpm build` - builds successfully
