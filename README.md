# Vue Notion

> **Vue Notion** is a fast and accurate Vue renderer for Notion. TS batteries included. ⚡️
>
> **Bộ render Notion cho Vue** cực nhanh và chính xác. Hỗ trợ đầy đủ TypeScript. 🚀
>
> **Vue Notion** は、Vue向けの高速で正確なNotionレンダラーです。TypeScriptに完全対応。 ⚡️

[![NPM](https://img.shields.io/npm/v/@slogvo/vue-notion.svg)](https://www.npmjs.com/package/@slogvo/vue-notion) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## 🚧 Work in Progress

This project is currently under active development. Star and watch this repo for updates!

## Features

- 🔍 **Search** - built-in full-text search with `SearchDialog`
- 🗂️ **Collections** - full support for database views (Gallery, List, Board, Table) including Grouping
- 🚀 **Simple** - TypeScript + Vue 3
- ⚡ **Fast** - Optimized rendering with lazy loading
- 💪 **Smooth** - Full SSR/SSG support with Nuxt 3
- 🎨 **Flexible** - Works with Vue 3, Nuxt 3, and any Vue-based framework

## Packages

| Package                                   | NPM | Environment   | Description                      |
| ----------------------------------------- | --- | ------------- | -------------------------------- |
| [vue-notion](./packages/vue-notion)       | TBD | Browser + SSR | Fast Vue renderer for Notion     |
| [notion-client](./packages/notion-client) | TBD | Server-side   | TypeScript client for Notion API |
| [notion-types](./packages/notion-types)   | TBD | Universal     | Core Notion TypeScript types     |
| [notion-utils](./packages/notion-utils)   | TBD | Universal     | Utilities for Notion data        |

## Quick Start

Check out the [vue-notion package](./packages/vue-notion/README.md) for installation and usage instructions.

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run in development mode
pnpm dev

# Run tests
pnpm test
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for current status and planned features.

## License

MIT © Vue Notion Contributors
