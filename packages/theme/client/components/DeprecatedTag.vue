<script lang="ts" setup>
import { ElTag } from 'element-plus';

defineProps<{
  version: string
}>();
</script>

<template>
  <ElTag
    size="small"
    type="warning"
    effect="plain"
    hit
    round
  >
    deprecated
  </ElTag>
</template>
