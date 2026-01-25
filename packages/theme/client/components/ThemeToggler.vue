<script setup lang="ts">
import type { SwitchInstance } from 'element-plus'
import { ElSwitch } from 'element-plus'
import { useData } from 'vitepress/client'
import { nextTick, ref } from 'vue'
import DarkIcon from '../icons/dark.vue'
import LightIcon from '../icons/light.vue'

const { site, isDark } = useData()
const switchRef = ref<SwitchInstance>()

function handleChange(value: boolean) {
  if (isDark.value !== value)
    isDark.value = value
}

function beforeChange() {
  return new Promise<boolean>((resolve) => {
    const isAppearanceTransition = document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isAppearanceTransition) {
      resolve(true)
      return
    }

    const switchElement = switchRef.value?.$el
    const rect = switchElement.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    const ratioX = (100 * x) / innerWidth
    const ratioY = (100 * y) / innerHeight
    const referR = Math.hypot(innerWidth, innerHeight) / Math.SQRT2
    const ratioR = (100 * endRadius) / referR

    const transition = document.startViewTransition(async () => {
      resolve(true)
      await nextTick()
    })
    transition.ready.then(() => {
      const clipPath = [
        `circle(0% at ${ratioX}% ${ratioY}%)`,
        `circle(${ratioR}% at ${ratioX}% ${ratioY}%)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-in',
          fill: 'both',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
  })
}
</script>

<template>
  <div class="VPNavBarAppearance">
    <ClientOnly>
      <ElSwitch
        v-if="
          site.appearance
            && site.appearance !== 'force-dark'
            && site.appearance !== 'force-auto'
        "
        ref="switchRef"
        :model-value="isDark"
        v-bind="$attrs"
        :before-change="beforeChange"
        :active-action-icon="DarkIcon"
        :inactive-action-icon="LightIcon"
        @change="handleChange"
      />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: var(--vp-nav-height);
  color: var(--vp-c-text-1);
  transition: color 0.5s;
}

:deep(.el-switch__core) {
  --el-switch-on-color: var(--bg-color-mute);
  --el-switch-off-color: var(--bg-color-mute);
  --el-switch-border-color: var(--border-color);

  .el-switch__action {
    width: 14px;
    height: 14px;
  }
}

:deep(.dark-icon) {
  border-radius: 50%;
  color: #cfd3dc;
  background-color: #141414;
}

:deep(.light-icon) {
  color: #606266;
}

.VPNavBarAppearance {
  display: none;
}

@media (min-width: 1280px) {
  .VPNavBarAppearance {
    display: flex;
    align-items: center;
  }
}
</style>
