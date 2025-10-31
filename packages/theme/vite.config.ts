import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
  ],
  css: {
    postcss: {},
    // 启用 CSS 代码分割
    modules: {
      scopeBehaviour: 'local',
    },
  },
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      formats: ['es', 'cjs'],
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
        {
          format: 'cjs',
          dir: 'dist/cjs',
          entryFileNames: '[name].cjs',
          preserveModules: true,
          preserveModulesRoot: __dirname,
          exports: 'named',
        },
      ],
    },
  },
})
