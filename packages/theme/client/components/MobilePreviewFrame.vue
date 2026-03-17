<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, ref, watch } from 'vue'
import { resolveMobilePreviewId } from '../mobile-preview'

const { frontmatter, isDark, theme } = useData()
const route = useRoute()
const frameRef = ref<HTMLIFrameElement>()
const previewConfig = computed(() => theme.value.mobilePreview ?? {})

const demoId = computed(() => {
  const value = frontmatter.value.mobileDemo
  return typeof value === 'string'
    ? resolveMobilePreviewId(value, previewConfig.value.demoRoot)
    : ''
})

const frameWidth = computed(() => `${previewConfig.value.deviceWidth ?? 390}px`)
const viewportHeight = computed(() => `${previewConfig.value.deviceHeight ?? 760}px`)

const previewHref = computed(() => {
  const previewPath = normalizePreviewPath(previewConfig.value.previewPath)
  const search = new URLSearchParams({
    demo: demoId.value,
    theme: isDark.value ? 'dark' : 'light',
  })

  return `${resolveLocalePreviewPath(route.path, previewPath)}?${search.toString()}`
})

const frameStyle = computed(() => ({
  '--vp-mobile-preview-width': frameWidth.value,
  '--vp-mobile-preview-height': viewportHeight.value,
}))

function normalizePreviewPath(value: unknown): string {
  if (typeof value !== 'string' || !value.trim())
    return 'preview/'

  return value
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/?$/, '/')
}

function resolveLocalePreviewPath(path: string, previewPath: string): string {
  const matchedLocale = path.match(/^\/([^/]+)\//)
  const localePrefix = matchedLocale ? `/${matchedLocale[1]}/` : '/'

  return `${localePrefix}${previewPath}`
}

function syncTheme(): void {
  frameRef.value?.contentWindow?.postMessage({
    type: 'vp-mobile-preview-theme',
    value: isDark.value ? 'dark' : 'light',
  }, '*')
}

watch(isDark, syncTheme)
</script>

<template>
  <section v-if="demoId" class="VPMobilePreviewFrame" :style="frameStyle">
    <div class="preview-actions">
      <span class="preview-actions__label">Mobile Preview</span>
      <a class="preview-actions__link" :href="previewHref" target="_blank" rel="noreferrer">
        Open
      </a>
    </div>

    <div class="preview-phone">
      <div class="preview-phone__camera" />
      <iframe
        ref="frameRef"
        class="preview-phone__viewport"
        :src="previewHref"
        title="Mobile demo preview"
        loading="lazy"
        @load="syncTheme"
      />
    </div>

    <a class="preview-mobile-link" :href="previewHref" target="_blank" rel="noreferrer">
      Open mobile preview
    </a>
  </section>
</template>

<style scoped lang="scss">
.preview-actions {
  display: none;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.preview-actions__label {
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-actions__link,
.preview-mobile-link {
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.preview-phone {
  display: none;
  position: relative;
  width: var(--vp-mobile-preview-width);
  padding: 14px 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.64)), rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 32px;
  box-shadow:
    0 24px 80px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
}

:global(.dark) .preview-phone {
  background: linear-gradient(180deg, rgba(24, 24, 27, 0.92), rgba(24, 24, 27, 0.8)), rgba(24, 24, 27, 0.86);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.preview-phone__camera {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 104px;
  height: 18px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.92);
  transform: translateX(-50%);
}

.preview-phone__viewport {
  display: block;
  width: 100%;
  height: var(--vp-mobile-preview-height);
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 0;
  border-radius: 24px;
}

.preview-mobile-link {
  display: inline-flex;
}

@media (min-width: 1440px) {
  .preview-actions {
    display: flex;
  }

  .preview-phone {
    display: block;
  }

  .preview-mobile-link {
    display: none;
  }
}
</style>
