<script lang="ts" setup>
import { ref } from 'vue';

import TodoItem from '@/components/TodoItem.vue';

import { Todo } from '@/stores/todos.store';

export type TodoListProps = {
  list: Todo[];
  itemClass?: string | object | Array<string | object>;
};

export type TodoListExposed = {
  focusTodoSibling: (
    position: 'next' | 'previous',
    targetOrIndex: HTMLElement | number,
  ) => void;
  focusoutTodo: (targetOrIndex: HTMLElement | number) => void;
};

export type TodoEvent = {
  todo: Todo;
  index: number;
} & TodoListExposed;

export type TodoListListeners = {
  (type: 'remove', event: TodoEvent): void;
  (type: 'complete', event: TodoEvent): void;
  (type: 'uncomplete', event: TodoEvent): void;
};

const props = withDefaults(defineProps<TodoListProps>(), {
  list: () => [],
});

defineEmits<TodoListListeners>();

const todoListRef = ref<HTMLElement | null>(null);

const withTodoList = <TReturn>(
  callback: (list: HTMLElement) => TReturn,
): TReturn | null => todoListRef.value && callback(todoListRef.value);

const getItem = (targetOrIndex: HTMLElement | number) => {
  const isIndex = typeof targetOrIndex === 'number';

  return isIndex
    ? withTodoList(($list) => $list.children[targetOrIndex] as HTMLElement)
    : targetOrIndex;
};

const getTodoSibling = (
  position: 'next' | 'previous',
  targetOrIndex: HTMLElement | number,
): HTMLElement | undefined => {
  const isIndex = typeof targetOrIndex === 'number';

  const $root = isIndex
    ? withTodoList(($list) => $list.children[targetOrIndex] as HTMLElement)
    : targetOrIndex.closest<HTMLElement>('[data-todo-item-root]');

  if (!$root) return;

  return (
    ($root?.[`${position}ElementSibling`]?.firstElementChild as HTMLElement) ||
    undefined
  );
};

const focusoutTodo = (targetOrIndex: HTMLElement | number) => {
  const $target = getItem(targetOrIndex);
  if (!$target) return;

  const $todo =
    getTodoSibling('previous', $target) || getTodoSibling('next', $target);

  $target.setAttribute('tabindex', '-1');

  if (!$todo) {
    withTodoList(($list) => $list.focus());
    return;
  }

  $todo.setAttribute('tabindex', '0');
  $todo.focus();
};

const focusTodoSibling = (
  position: 'next' | 'previous',
  targetOrIndex: HTMLElement | number,
) => {
  const $target = getItem(targetOrIndex);
  if (!$target) return;

  const $next = getTodoSibling(position, $target);
  if (!$next) return;

  $target.setAttribute('tabindex', '-1');
  $next.setAttribute('tabindex', '0');
  $next.focus();
};

defineExpose<TodoListExposed>({
  focusTodoSibling,
  focusoutTodo,
});

const handleNextTodo = (e: Event) => {
  const $target = e.target as HTMLElement;
  focusTodoSibling('next', $target);
};

const handlePrevTodo = (e: Event) => {
  const $target = e.target as HTMLElement;
  focusTodoSibling('previous', $target);
};

const handleFocusOutside = (e: FocusEvent) => {
  const $target = e.target as HTMLElement,
    $list = $target.closest<HTMLElement>('[data-todo-list]');

  if (!$list) return;

  const $relatedTarget = e.relatedTarget as Node | null,
    isOutsideList = !$relatedTarget || !$list.contains($relatedTarget);
  if (!isOutsideList) return;

  $target.setAttribute('tabindex', '-1');

  const $firstItem = $list.querySelector('[tabindex]');
  if (!$firstItem) return;

  $firstItem.setAttribute('tabindex', '0');
};

const createTodoEvent = (index: number) => ({
  index,
  todo: props.list[index],
  focusoutTodo,
  focusTodoSibling,
});
</script>

<template>
  <ul
    ref="todoListRef"
    tabindex="-1"
    aria-label="Use the keys up and down from your keyboard to go and back through your to do items"
    @keydown.prevent.up="handlePrevTodo"
    @keydown.prevent.down="handleNextTodo"
    @focusout="handleFocusOutside"
    data-todo-list
  >
    <li
      data-todo-item-root
      :class="itemClass"
      v-for="(todo, index) in list"
      :key="todo.id"
      @keydown.delete="$emit('remove', createTodoEvent(index))"
    >
      <todo-item
        :id="todo.id"
        :checked="todo.completed"
        :tabindex="index === 0 ? 0 : -1"
        @change="
          (checked) =>
            checked
              ? $emit('complete', createTodoEvent(index))
              : $emit('uncomplete', createTodoEvent(index))
        "
      >
        {{ todo.description }}
      </todo-item>
    </li>
  </ul>
</template>
