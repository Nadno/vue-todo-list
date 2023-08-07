<script setup lang="ts">
import { pixels } from '@/utils/styling';

export type SvgIconBaseProps = {
  size?: number | string;
  width?: number | string;
  height?: number | string;
};

defineProps<SvgIconBaseProps>();
</script>

<template>
  <svg
    aria-hidden="true"
    fill="currentColor"
    :style="{
      width: pixels(size || width),
      height: pixels(size || height),
      pointerEvents: 'none',
    }"
  >
    <slot />
  </svg>
</template>
