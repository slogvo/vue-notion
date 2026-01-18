# @slogvo/vue-notion

> **Vue Notion** is a fast and accurate Vue 3 renderer for Notion. Use Notion as a CMS for your Vue or Nuxt applications. ⚡️
>
> **Vue Notion** là bộ render Notion cho **Vue 3** và **Nuxt 3** cực nhanh và chính xác. Giải pháp hoàn hảo để dùng Notion làm CMS. 🚀
>
> **Vue Notion** は、Vue 3 および Nuxt 3 向けの高速で正確な Notion レンダラーです。Notion を CMS として利用するための最適なソリューションです。 ⚡️

## SEO Keywords

`Vue Notion Renderer`, `Vue 3 Notion`, `Nuxt 3 Notion API`, `Notion CMS Vue`, `Renderer Notion Vue 3`, `Hiển thị Notion trên Vue`, `Notion API client for Vue`, `Notion SDK Vue`, `Notion to HTML Vue`

## Features

- ⚡ **Fast** - Optimized rendering with lazy loading
- 🎨 **Flexible** - Fully customizable components and styling
- 🔍 **Search** - Built-in full-text search support
- 🗂️ **Collections** - Rich support for database views:
  - Table (with resizing)
  - Gallery
  - List
  - Board (with grouping)
- 🛠️ **Universal** - Works with Vue 3 and Nuxt 3 (SSR/SSG friendly)

## Installation

```bash
# using pnpm
pnpm add @slogvo/vue-notion @slogvo/notion-client @slogvo/notion-types @slogvo/notion-utils

# using npm
npm install @slogvo/vue-notion @slogvo/notion-client @slogvo/notion-types @slogvo/notion-utils
```

## Usage

### Basic Rendering

```vue
<script setup lang="ts">
import { NotionRenderer } from '@slogvo/vue-notion'
import { NotionAPI } from '@slogvo/notion-client'

// Fetch data on the server (e.g., in Nuxt useAsyncData or getServerSideProps)
// Option 1: Public pages (unofficial API)
// const api = new NotionAPI()

// Option 2: Private pages (Official API)
const api = new NotionAPI({
  officialApiToken: 'your-integration-token'
})

const recordMap = await api.getPage('your-page-id')
</script>

<template>
  <NotionRenderer :record-map="recordMap" full-page class="notion-page" />
</template>

<style>
/* Import the styles */
@import '@slogvo/vue-notion/styles.css';
</style>
```

#### New Features (v0.2.1)

- **Official API Support**: Use `officialApiToken` in `NotionAPI` to fetch private pages.
- **Hide Header**: Pass `hide-header` prop to remove breadcrumbs/icon from full page view.
- **Dark Mode**: Pass `dark-mode` prop to sync with your app's theme.

```vue
<NotionRenderer
  :record-map="recordMap"
  full-page
  hide-header
  :dark-mode="isDarkMode"
/>
```

### Enabling Search

To enable the search functionality, pass the `searchNotion` prop to the renderer:

```vue
<script setup lang="ts">
import { NotionRenderer } from '@slogvo/vue-notion'

// Define your search function (server-side wrapper)
const searchNotion = async params => {
  // Call your API endpoint that wraps notion-client's search
  return await $fetch('/api/notion/search', {
    method: 'POST',
    body: params
  })
}
</script>

<template>
  <NotionRenderer
    :record-map="recordMap"
    :search-notion="searchNotion"
    full-page
  />
</template>
```

### Customizing Components

You can override any default component by passing a `components` map:

```vue
<script setup lang="ts">
import { NotionRenderer } from '@slogvo/vue-notion'
import MyCustomLink from './MyCustomLink.vue'

const customComponents = {
  PageLink: MyCustomLink
}
</script>

<template>
  <NotionRenderer :record-map="recordMap" :components="customComponents" />
</template>
```

## Styling

`@slogvo/vue-notion` comes with a comprehensive CSS file that closely mimics Notion's default styling.

You can import it in your main CSS file or component:

```css
@import '@slogvo/vue-notion/styles.css';
```

Classes are prefixed with `.notion-` to avoid conflicts. You can easily override variables for theming:

```css
:root {
  --notion-font: 'Inter', sans-serif;
  --fg-color: #333;
  --bg-color: #fff;
}
```

## Credits

This project is a Vue port of the excellent [react-notion-x](https://github.com/NotionX/react-notion-x) by [Travis Fischer](https://github.com/transitive-bullshit).
