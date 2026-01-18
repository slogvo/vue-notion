# System Context: Vue Notion

## Project Type

This is a **monorepo** containing Vue 3 components and TypeScript libraries for rendering Notion pages.

## Key Technologies

- **Vue 3** with Composition API
- **TypeScript 5.x**
- **pnpm Workspaces**
- **Turbo** for build orchestration
- **Vite/tsup** for building packages
- **Vitest** for testing

## Important Notes for AI

1. This is a port of `react-notion-x` to Vue 3. Consistency with the original logic is key.
2. The core packages are in the `packages/` directory.
3. Examples are in the `examples/` directory.
4. Deployment/Publishing is handled via `pnpm release`.
5. SSR (Server-Side Rendering) support is critical as many users use this with Nuxt 3.

## Architectural Patterns

- **Separation of Concerns**: Keep types, utils, and API client separate from the Vue rendering logic.
- **Hydration Safety**: Ensure components are SSR-friendly and don't cause hydration mismatches.
- **Dynamic Components**: Use `<component :is="...">` for rendering various block types dynamically.
