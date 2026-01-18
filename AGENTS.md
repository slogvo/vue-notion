# Repository Guidelines: Vue Notion

## Project Structure & Module Organization

- `packages/`: Contains all core libraries and renderers.
  - `packages/vue-notion`: Core Vue 3 renderer.
  - `packages/notion-client`: API client.
  - `packages/notion-types`: Universal type definitions.
  - `packages/notion-utils`: Common utilities.
- `examples/`: Demo applications and development playgrounds.
- `scripts/`: Maintenance and build scripts.

## Build, Test, and Development Commands

- `pnpm install`: Install dependencies for the entire workspace.
- `pnpm dev`: Start development mode with live reload across packages.
- `pnpm build`: Build all packages using Turbo and Tsup.
- `pnpm test`: Run all tests in the workspace.
- `pnpm test:typecheck`: Run TypeScript validation across all packages.
- `pnpm test:lint`: Run ESLint checks.
- `pnpm test:format`: Run Prettier formatting checks.
- `pnpm release`: Bump versions and publish all packages.

## Coding Style & Naming Conventions

- Use TypeScript with strict mode.
- Vue components use PascalCase (e.g., `NotionRenderer.vue`).
- Follow the logic and structure of `react-notion-x` as closely as possible while being Vue-idiomatic.
- Use scoped CSS for component styling.
- All exported functions and methods must have explicit type annotations.

## Testing Guidelines

- Tests use Vitest.
- Place tests in `__tests__` directories or alongside the code as `*.test.ts`.
- Ensure renderer tests verify HTML output stability.

## Commit Guidelines

- Use Conventional Commits.
- Use package names as scope, for example: `fix(notion-client): handle 404 responses`.
- Always run pre-flight checks (`test:typecheck`, `test:lint`, `test`, `build`) before committing.
