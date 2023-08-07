<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

export type CheckboxProps = {
  id?: string;
  modelValue?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  tabindex?: string | number;
};

export type CheckboxListeners = {
  (type: 'update:modelValue', value: boolean): void;
  (type: 'change', value: boolean): void;
  (type: 'focus', event: Event): void;
  (type: 'blur', event: Event): void;
};

const props = defineProps<CheckboxProps>(),
  emit = defineEmits<CheckboxListeners>();

const currentValue = ref<boolean>(!!props.modelValue),
  isFocused = ref<boolean>(false);

watchEffect(() => {
  const checked = props.modelValue;
  currentValue.value = checked;
});

const handleChange = () => {
  const checked = !currentValue.value;
  currentValue.value = checked;
  emit('change', checked);
  emit('update:modelValue', checked);
};

const handleFocusOrBlur = (e: Event) => {
  isFocused.value = e.type === 'focus';
  emit(e.type as 'focus', e);
};
</script>

<template>
  <span
    class="check"
    :data-state="currentValue ? 'active' : 'desactive'"
    :data-focus="isFocused"
  >
    <slot v-if="currentValue" />

    <input
      type="checkbox"
      :id="id"
      class="input"
      :value="currentValue"
      @change="handleChange"
      @focus="handleFocusOrBlur"
      @blur="handleFocusOrBlur"
      :tabindex="tabindex"
      :readonly="readonly"
      :disabled="disabled"
    />
  </span>
</template>

<style lang="scss" scoped>
.check {
  position: relative;
  display: block;
}

.check .input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  left: 0;
  top: 0;
  z-index: 1;
}
</style>
