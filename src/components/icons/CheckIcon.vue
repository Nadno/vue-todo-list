<script setup lang="ts">
import SvgIconBase, { SvgIconBaseProps } from './SvgIconBase.vue';

defineProps<SvgIconBaseProps>();
</script>

<template>
  <!-- ICON FROM: https://oh-vue-icons.js.org/ -->
  <svg-icon-base v-bind="$props" viewBox="-1.6 -1.6 19.2 19.2">
    <path
      d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"
    ></path>
  </svg-icon-base>
</template>
