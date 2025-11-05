import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'vitepress',
        /^vitepress\/.*/,
      ],
      output: [
        {
          format: 'es',
          dir: 'dist/esm',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: __dirname,
          exports: 'named',
        },
      ],
    },
  },
})
