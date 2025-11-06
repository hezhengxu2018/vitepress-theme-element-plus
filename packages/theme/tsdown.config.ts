import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./node/index.ts'],
  unbundle: true,
})
