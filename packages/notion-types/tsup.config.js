export default {
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'es2018',
  platform: 'browser',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: false,
  dts: true
}

