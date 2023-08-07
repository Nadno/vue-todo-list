<script lang="ts" setup>
import TodoList, { TodoEvent } from './components/TodoList.vue';

import AddIcon from '@/components/icons/AddIcon.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';

import { useTodos } from '@/stores/todos.store';
import { ref } from 'vue';

const newTodoDescription = ref('');

const todos = useTodos();

const handleCreateTodo = () => {
  const description = newTodoDescription.value;
  if (!description) return;

  todos.add(description);
  newTodoDescription.value = '';
};

const handleComplete = ({ todo, index, focusoutTodo }: TodoEvent) => {
  todos.complete(todo.id);
  focusoutTodo(index);
};

const handleUncomplete = ({ todo, index, focusoutTodo }: TodoEvent) => {
  todos.uncomplete(todo.id);
  focusoutTodo(index);
};

const handleRemove = ({ todo, index, focusoutTodo }: TodoEvent) => {
  todos.remove(todo.completed ? 'completed' : 'uncompleted', todo.id);
  focusoutTodo(index);
};
</script>

<template>
  <main class="main">
    <h1 class="_sr-only">Todo list</h1>

    <section class="create-form content">
      <h2 class="_sr-only" id="create-form-title">Create a new todo item</h2>

      <form class="form" @submit.prevent="handleCreateTodo">
        <input
          class="input"
          type="text"
          name="todo-description"
          id="todo-description"
          aria-labelledby="create-form-title"
          v-model.trim="newTodoDescription"
        />

        <button class="submit" type="submit" aria-label="Create">
          <add-icon class="icon" :size="24" />
        </button>
      </form>
    </section>

    <section class="filter-form content">
      <h2 class="_sr-only" id="filter-form-title">Filter the todo lists</h2>

      <form
        class="form"
        aria-labelledby="filter-form-title"
        aria-controls="uncompleted-todos completed-todos"
      >
        <button>
          <search-icon :size="24" />
        </button>
      </form>
    </section>

    <div class="content -todos">
      <section class="todo-list">
        <h2 class="title">ToDo</h2>

        <todo-list
          ref="uncompletedTodosRef"
          class="list"
          id="uncompleted-todos"
          :list="todos.list.uncompleted"
          @complete="handleComplete"
          @remove="handleRemove"
        />
      </section>

      <section class="todo-list">
        <h2 class="title">Completed</h2>

        <todo-list
          ref="completedTodosRef"
          class="list"
          id="uncompleted-todos"
          :list="todos.list.completed"
          @uncomplete="handleUncomplete"
          @remove="handleRemove"
        />
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.main {
  width: 100%;
  min-height: 100vh;

  padding: spacing(400);

  & > .content {
    margin-bottom: spacing(400);

    &.-todos {
      display: flex;
      flex-direction: column;
      gap: spacing(700);
      margin-top: spacing(700);
    }
  }
}

.create-form {
  width: 100%;
  border-radius: 4px;
  background-color: color('white');

  .form {
    display: flex;
    border-radius: inherit;
  }

  .input {
    width: 100%;
    border: none;
    border-radius: inherit;
    padding: spacing(200) spacing(300);

    font-size: text('bg');

    &:focus-visible {
      outline: none;
    }
  }

  .submit {
    @extend %reset-button-appearance;

    padding: spacing(200);
    border-radius: inherit;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: color('primary');

    .icon {
      transition: transform 250ms ease-out;
    }

    @include hover {
      cursor: pointer;

      background-color: color('primary-dark');
    }
  }
}

.todo-list {
  .title {
    margin-bottom: spacing(200);

    font-size: text('sm');
    color: darken(color('text-light'), 25%);
    text-transform: uppercase;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: spacing(200);

    list-style: none;
    user-select: none;
    font-size: text('sm');
  }
}
</style>
