# 🧠 AI-Optimized Project Context: Vue Notion

## 1. Executive Summary

**Project Name:** Vue Notion (vue-notion-x)
**Core Technology:** Vue 3, TypeScript, pnpm Workspaces
**Mission:** Provide a fast, accurate, and type-safe Notion renderer for the Vue 3 ecosystem.

## 2. Technical Architecture

### Monorepo Structure

- `packages/vue-notion`: Core Vue renderer components.
- `packages/notion-client`: API client for Notion.
- `packages/notion-types`: Shared type definitions.
- `packages/notion-utils`: Shared utilities.
- `examples/`: Demo and test applications (Nuxt 3, Vite).

### Tech Stack

- **Frontend:** Vue 3, Nuxt 3 (for demos)
- **Tooling:** pnpm, Turbo, Vite, ESLint, Prettier
- **Language:** TypeScript 5.x

## 3. Key Directories

- `packages/`: All core code for the library.
- `examples/`: Usage examples and development playground.
- `scripts/`: Build and maintenance scripts.

## 4. Development Guidelines

- **TypeScript First:** Ensure all code is fully typed and exported where necessary.
- **Porting Logic:** When porting from `react-notion-x`, maintain logic consistency while adapting to Vue 3 primitives (e.g., refs, computed instead of hooks).
- **Component Pattern:** Use functional components or SFCs with `<script setup lang="ts">`.
- **Styling:** Use scoped CSS or modular CSS to avoid leaking styles to the consumer's app.

## 5. Commands Reference

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development mode for packages and examples
- `pnpm build` - Build all packages
- `pnpm test` - Run tests
- `pnpm lint` - Run linting checks
- `pnpm clean` - Remove build artifacts
