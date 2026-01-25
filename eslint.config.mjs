// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  prettier: true,
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },
  rules: {
    'vue/no-v-text-v-html-on-component': 'off',
  },
  formatters: {
    css: true,
  },
})
