<script lang="ts" setup>
import { ElTag } from 'element-plus';

defineProps<{
  version: string
}>();
</script>

<template>
  <ElTag
    size="small"
    effect="plain"
    hit
    round
  >
    {{ version }}
  </ElTag>
</template>
