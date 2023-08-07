<script setup lang="ts">
import SvgIconBase, { SvgIconBaseProps } from './SvgIconBase.vue';

defineProps<SvgIconBaseProps>();
</script>

<template>
  <!-- ICON FROM: https://oh-vue-icons.js.org/ -->
  <svg-icon-base v-bind="$props" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg-icon-base>
</template>
