<script lang="ts" setup>
import { useData } from 'vitepress'
import { ElDivider } from 'element-plus'

const { theme } = useData()
</script>

<template>
  <template v-if="theme.footer?.message || theme.footer?.copyright">
    <ElDivider style="margin-bottom: 0px" />
    <div class="footer-copyright">
      <p>{{ theme.footer?.message }}</p>
      <p>{{ theme.footer?.copyright }}</p>
    </div>
  </template>
</template>

<style scoped lang="scss">
.footer-copyright {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  font-size: 12px;
  line-height: 24px;
}
</style>