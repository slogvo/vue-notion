import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueNotionX',
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'vue',
        'notion-types',
        'notion-utils',
        'prismjs',
        'katex',
        'medium-zoom'
      ],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    outDir: 'build',
    emptyOutDir: true
  }
})
