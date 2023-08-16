<script setup lang="ts">
import SvgIconBase, { SvgIconBaseProps } from './SvgIconBase.vue';

defineProps<SvgIconBaseProps>();
</script>

<template>
  <!-- ICON FROM: https://oh-vue-icons.js.org/ -->
  <svg-icon-base v-bind="$props" viewBox="0.48 0.48 23.04 23.04"
    ><path fill="none" d="M0 0h24v24H0z"></path
    ><path d="M12 3L4 9v12h5v-7h6v7h5V9z"></path
  ></svg-icon-base>
</template>
