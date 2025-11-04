<script lang="ts" setup>
import { useData } from 'vitepress'
import { useLayout } from 'vitepress/theme'
import { ElLink } from 'element-plus'

const { isHome } = useLayout()
const { theme } = useData()
const blogroll = theme.value.footer?.blogroll
</script>

<template>
  <footer class="footer" :class="{ 'is-home': isHome }">
    <div v-if="blogroll && blogroll.length" class="footer-main" v-for="item of blogroll" :key="item.title">
      <h4>{{ item.title }}</h4>
      <ElLink
        v-for="child of item.children"
        class="footer-main-link"
        target="_blank"
        type="info"
        :href="child.href"
        :underline="false"
      >
        {{ child.title }}
      </ElLink>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  background-color: var(--vp-c-bg-soft);
  box-sizing: border-box;
  padding: 42px 64px 64px;

  &.is-home {
    background-color: var(--bg-color);
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 0;
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