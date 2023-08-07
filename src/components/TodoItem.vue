<script lang="ts" setup>
import { ref } from 'vue';

import Checkbox from './Checkbox.vue';

import CheckIcon from './icons/CheckIcon.vue';

export type TodoItemProps = {
  id: string;
  modelValue?: boolean;
};

export type TodoItemListeners = {
  (type: 'change', value: boolean): void;
};

const props = defineProps({
    id: {
      req: true,
      type: String,
    },
    checked: {
      req: false,
      type: Boolean,
      default: false,
    },
    modelValue: {
      req: false,
      type: Boolean,
      default: null,
    },
  }),
  emit = defineEmits<TodoItemListeners>();

const isComplete = ref<boolean>(props.modelValue ?? props.checked);
const handleChange = (checked: boolean) => {
  isComplete.value = checked;
  emit('change', checked);
};
</script>

<template>
  <label
    class="todo-item"
    :class="{
      '-completed': isComplete,
    }"
    :for="id"
    @keydown.enter="handleChange(!isComplete)"
  >
    <checkbox
      :id="id"
      class="check"
      :model-value="isComplete"
      @change="handleChange"
      tabindex="-1"
      readonly
    >
      <check-icon class="indicator" />
    </checkbox>

    <span class="content">
      <slot />
    </span>
  </label>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.todo-item {
  display: flex;
  align-items: center;
  gap: spacing(400);

  border-radius: 4px;
  padding: spacing(200);
  background-color: color('white', 0.1);

  .check {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: color('white');

    flex-shrink: 0;

    &[data-state='active'] {
      background-color: yellowgreen;
    }
  }

  .check .indicator {
    color: color('text-light');
  }

  .content {
    width: 100%;
    min-width: 0;
    max-width: 100%;

    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.-completed {
    text-decoration: line-through;
  }

  &:focus-visible {
    outline-offset: 2px;
    outline: 2px solid color('primary');
  }
}
</style>
