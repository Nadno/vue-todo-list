<script setup lang="ts">
export type DropdownMenuItemProps = {
  disabled?: boolean;
  autoclose?: boolean;
  value?: any;
  modelValue?: any;
};

export type DropdownMenuItemEvents = {
  (type: 'onSelect', value: any): void;
  (type: 'update:modelValue', value: boolean): void;
};

const emit = defineEmits<DropdownMenuItemEvents>(),
  props = withDefaults(defineProps<DropdownMenuItemProps>(), {
    value: undefined,
    disabled: undefined,
    autoclose: undefined,
  });

const handleSelectMenuItem = () => {
  if (props.disabled) return;
  emit('update:modelValue', props.value);
  emit('onSelect', props.value);
};
</script>

<template>
  <button
    :data-disabled="disabled"
    :data-autoclose="autoclose"
    :aria-disabled="disabled"
    @click="handleSelectMenuItem"
    role="menuitem"
    class="dropdown-menu-item"
    tabindex="-1"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.dropdown-menu-item {
  appearance: none;
  border: none;
  background-color: transparent;
}
</style>
