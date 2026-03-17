<script setup lang="ts">
import type { Component } from 'vue'
import { useData } from 'vitepress'
import { computed, inject, markRaw, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { mobilePreviewRegistryKey, resolveMobilePreviewId } from '../mobile-preview'

const { frontmatter, theme } = useData()
const registry = inject(mobilePreviewRegistryKey)
const demoId = ref('')
const errorMessage = ref('')
const isLoading = ref(true)
const demoComponent = shallowRef<Component>()
const previewConfig = computed(() => theme.value.mobilePreview ?? {})

const statusMessage = computed(() => {
  if (errorMessage.value)
    return errorMessage.value

  return isLoading.value ? 'Loading mobile preview...' : 'No preview loaded.'
})

function applyTheme(theme: string | null): void {
  if (typeof document === 'undefined')
    return

  document.documentElement.classList.toggle('dark', theme === 'dark')
}

async function loadDemo(value: string | null): Promise<void> {
  demoId.value = resolveMobilePreviewId(value ?? '', previewConfig.value.demoRoot)
  demoComponent.value = undefined
  errorMessage.value = ''
  isLoading.value = true

  if (!demoId.value) {
    errorMessage.value = 'Missing demo id.'
    isLoading.value = false
    return
  }

  if (!registry) {
    errorMessage.value = 'No mobile preview registry was provided.'
    isLoading.value = false
    return
  }

  const loader = registry[demoId.value]
  if (!loader) {
    errorMessage.value = `Unknown demo: ${demoId.value}`
    isLoading.value = false
    return
  }

  try {
    const module = await loader()
    const resolvedComponent = (module as { default?: Component }).default ?? module
    demoComponent.value = markRaw(resolvedComponent as Component)
  }
  catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Failed to load the requested demo.'
  }
  finally {
    isLoading.value = false
  }
}

function syncFromLocation(): void {
  if (typeof window === 'undefined')
    return

  const search = new URLSearchParams(window.location.search)
  const fallbackDemo = typeof frontmatter.value.mobileDemo === 'string'
    ? frontmatter.value.mobileDemo
    : null
  applyTheme(search.get('theme'))
  void loadDemo(search.get('demo') ?? fallbackDemo)
}

function handleMessage(event: MessageEvent): void {
  if (event.data?.type !== 'vp-mobile-preview-theme')
    return

  applyTheme(event.data.value)
}

onMounted(() => {
  syncFromLocation()
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <main class="VPMobilePreviewLayout">
    <component :is="demoComponent" v-if="demoComponent" />
    <div v-else class="preview-status">
      <p class="preview-status__title">
        Mobile Preview
      </p>
      <p class="preview-status__body">
        {{ statusMessage }}
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.VPMobilePreviewLayout {
  min-height: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.preview-status {
  display: grid;
  place-items: center;
  align-content: center;
  min-height: 100vh;
  padding: 24px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.preview-status__title {
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.preview-status__body {
  margin: 0;
  font-size: 14px;
}
</style>
