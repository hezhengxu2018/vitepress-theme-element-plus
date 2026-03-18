<script lang="ts" setup>
import { ElLink } from 'element-plus'
import { useData } from 'vitepress'
import { useLayout } from 'vitepress/theme'
import { computed } from 'vue'

const { isHome } = useLayout()
const { theme } = useData()
const blogroll = theme.value.footer?.blogroll

const linkUnderline = computed(() => {
  const underlineProp = (ElLink as any)?.props?.underline
  const types = Array.isArray(underlineProp?.type)
    ? underlineProp.type
    : underlineProp?.type
      ? [underlineProp.type]
      : []
  return types.includes(String) ? 'never' : false
})
</script>

<template>
  <footer v-if="blogroll && blogroll.length" class="footer" :class="{ 'is-home': isHome }">
    <div v-for="item of blogroll" :key="item.title" class="footer-main">
      <h4>{{ item.title }}</h4>
      <ElLink
        v-for="child of item.children"
        :key="child.text"
        class="footer-main-link"
        target="_blank"
        :href="child.link"
        :underline="linkUnderline"
      >
        {{ child.text }}
      </ElLink>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  background-color: var(--vp-c-bg-soft);
  box-sizing: border-box;
  padding: 0px 64px 64px;

  &.is-home {
    background-color: var(--bg-color);
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 64px;
  }

  .container {
    box-sizing: border-box;
    width: auto;
  }

  .footer-main {
    font-size: 0;
    display: inline-block;
    vertical-align: top;
    margin-right: 130px;
    margin-top: 42px;
    width: 200px;

    h4 {
      font-size: 18px;
      line-height: 1;
      margin: 0 0 15px;
      font-weight: 400;
      color: var(--el-text-color-primary);
    }

    .footer-main-link {
      display: block;
      margin: 0;
      line-height: 2;
      color: var(--text-color-light);

      &:hover {
        color: var(--text-color);
      }

      & .el-link__inner {
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}

@media (max-width: 768px) {
  .footer {
    .footer-main {
      margin-bottom: 30px;
    }
  }
}
</style>
