# Vue Notion - Project Roadmap

> **AI Agent Guide**: This file tracks the project's current status and next steps. Always read this file before making changes.

## 📍 Current Status

**Project Phase**: 🏗️ **Phase 4: Advanced Features & Refinement**  
**Last Updated**: 2026-01-16  
**Version**: 0.1.0

---

## ✅ Completed

### Phase 0: Planning

- [x] Created implementation plan
- [x] Created task breakdown
- [x] Created ROADMAP.md (this file)
- [x] Defined project architecture

### Phase 1: Project Setup

- [x] Create directory structure
- [x] Initialize git repository
- [x] Create root package.json with pnpm workspace
- [x] Create pnpm-workspace.yaml
- [x] Create turbo.json
- [x] Create root tsconfig.json
- [x] Create .gitignore
- [x] Create LICENSE file

### Phase 2: Universal Packages

- [x] Copy notion-client package
- [x] Copy notion-types package
- [x] Copy notion-utils package
- [x] Verify all packages build correctly

### Phase 3: Vue Notion Core Package

- [x] Setup package structure
- [x] Create NotionRenderer.vue component
- [x] Implement core block components:
  - [x] Text
  - [x] Page
  - [x] Heading (H1, H2, H3)
  - [x] BulletedList
  - [x] NumberedList
  - [x] Image (Progressive loading with LQIP)
  - [x] Code (PrismJS highlighting)
  - [x] Quote
  - [x] Callout
  - [x] Asset (Video, Youtube, Embed, PDF)
  - [x] Divider
  - [x] Column / ColumnList
  - [x] Toggle
  - [x] ToDo (Checkbox)
  - [x] PageIcon (Emoji & Images)
- [x] Implement third-party components:
  - [x] Equation (KaTeX)
- [x] Create context & hooks:
  - [x] provideNotionContext / useNotionContext
- [x] Port and adapt CSS styles
- [x] Setup TypeScript types (env.d.ts for missing modules)
- [x] Configure Vite build process with DTS generation

### Phase 4: Example Applications & Infrastructure

- [x] Refactor architecture to use `apps/` directory
- [x] Create Nuxt 3 example (`apps/examples`)
- [x] Create Documentation app (`apps/docs`)
- [x] Integrate notion-client in Nuxt server API
- [x] Configure multi-app dev environment (Port 3000 & 3001)

---

## 🚧 In Progress

### Phase 3 & 4: Advanced Blocks & Refinement

- [x] Implement Collection components (Gallery, List, Table, Board)
- [x] Implement Table of Contents
- [x] Implement Breadcrumbs
- [x] Implement Bookmark component
- [x] Implement Modal component
- [x] Add Medium Zoom support for images (Integrated in LazyImage, logic in NotionRenderer)
- [x] Implement Search functionality
- [x] Implement Collection Groups

### Phase 5: Documentation

- [x] Write main README.md
- [x] Write package-specific READMEs
- [ ] Create API documentation (using `apps/docs`)
- [ ] Write contributing guide

---

## 📋 Planned Features

### Phase 6: Testing & Publishing

- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Optimize bundle size
- [ ] Publish to npm
- [x] Setup CI/CD pipeline

---

## 🎯 Next Steps (For AI Agent)

1. **Setup Publication**
   - Prepare for the first alpha release on npm.

---

## 🔧 Technical Decisions

### Build Tools

- **Package Manager**: pnpm
- **Monorepo**: Turborepo (Apps in `apps/*`, Packages in `packages/*`)
- **Bundler**: Vite (Lib mode) for `vue-notion`
- **Framework**: Vue 3 with Composition API

### Code Style

- **TypeScript**: Strict mode
- **Vue Style**: `<script setup>`
- **Styling**: Vanilla CSS (Notion-compatible classes)

---

## 🐛 Known Issues

- [ ] `notion-utils` and `notion-client` need proper types or better declaration files (currently using `env.d.ts`).
- [ ] Medium Zoom needs testing with SSR (already added window check).
- [x] Fix `embed` block not rendering if source is an image url (Needs fix in Asset.vue)
- [ ] Add responsive styles for `notion-title`, `notion-h1`, `h2`, `h3` (currently too large on mobile).

---

## 📦 Package Versions

| Package       | Current Version | Status      |
| ------------- | --------------- | ----------- |
| vue-notion    | 0.1.0           | Local Build |
| notion-client | 0.1.0           | Local Build |
| notion-types  | 0.1.0           | Local Build |
| notion-utils  | 0.1.0           | Local Build |

---

**Project Repository**: https://github.com/slogvo/vue-notion.git
