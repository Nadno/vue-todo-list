<script lang="ts" setup>
import DropdownMenu from '@/components/DropdownMenu.vue';
import DropdownMenuItem from '@/components/DropdownMenuItem.vue';
import TodoList, { TodoEvent } from '@/components/TodoList.vue';

import AddIcon from '@/components/icons/AddIcon.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';

import {
  TodosFilterSortByKeys,
  useTodos,
  useTodosFilter,
} from '@/stores/todos.store';
import { watch, reactive, ref } from 'vue';
import SortDownIcon from './components/icons/SortDownIcon.vue';

const SORT_MENU_ITEMS: Record<TodosFilterSortByKeys, string> = {
  'A-Z': 'A-Z',
  'Z-A': 'Z-A',
  recent: 'Recent',
  older: 'Older',
  'recently-added': 'Recently added',
};

const newTodoDescription = ref(''),
  searchTodo = ref(''),
  selectedSortType = ref<TodosFilterSortByKeys>('recently-added');

const globalTodosFilter = reactive({
  search: '',
  sortBy: selectedSortType.value,
});

const todos = useTodos(),
  uncompletedTodos = useTodosFilter(todos.list.uncompleted, globalTodosFilter),
  completedTodos = useTodosFilter(todos.list.completed, globalTodosFilter);

watch(
  selectedSortType,
  () => (globalTodosFilter.sortBy = selectedSortType.value),
);

const handleFilterTodos = () => {
  globalTodosFilter.search = searchTodo.value;
};

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
          placeholder="Add new To do: 'Clean my bedroom'"
        />

        <button class="submit" type="submit" aria-label="Create">
          <add-icon class="icon" :size="24" />
        </button>
      </form>
    </section>

    <section class="filter-form content">
      <h2 class="_sr-only" id="filter-form-title">Filter the todo lists</h2>

      <div class="search-form form">
        <form
          class="form"
          aria-labelledby="filter-form-title"
          aria-controls="uncompleted-todos completed-todos"
          @submit.prevent="handleFilterTodos"
        >
          <input
            class="input"
            type="search"
            name="todo-search"
            id="todo-search"
            v-model.trim="searchTodo"
            placeholder="Search for words"
          />

          <button class="submit" type="submit" aria-label="Search">
            <search-icon :size="24" />
          </button>
        </form>
      </div>

      <dropdown-menu
        class="sort-menu-container"
        id="sort-by-menu"
        label="Sort by"
        placement="bottom-end"
      >
        <template #menu-trigger="{ attrs, toggle }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="sort-menu-trigger"
            aria-label="Sort by"
          >
            {{ SORT_MENU_ITEMS[selectedSortType] }}

            <sort-down-icon class="icon" :size="24" />
          </button>
        </template>

        <template #menu-content="{ attrs }">
          <div class="sort-menu" v-bind="attrs">
            <dropdown-menu-item class="item" disabled>
              Sort by
            </dropdown-menu-item>

            <dropdown-menu-item
              v-for="(sortLabel, sortType) in SORT_MENU_ITEMS"
              v-model="selectedSortType"
              :key="sortType"
              :value="sortType"
              class="item"
            >
              {{ sortLabel }}
            </dropdown-menu-item>
          </div>
        </template>
      </dropdown-menu>
    </section>

    <div class="content -todos">
      <section class="todo-list">
        <h2 class="title">ToDo</h2>

        <todo-list
          class="list"
          id="uncompleted-todos"
          :list="uncompletedTodos"
          @complete="handleComplete"
          @remove="handleRemove"
        />
      </section>

      <section class="todo-list">
        <h2 class="title">Completed</h2>

        <todo-list
          class="list"
          id="uncompleted-todos"
          :list="completedTodos"
          @uncomplete="handleUncomplete"
          @remove="handleRemove"
        />
      </section>
    </div>
  </main>
  <footer class="footer">
    <p>
      Site icons from:
      <a
        class="link"
        href="https://oh-vue-icons.js.org/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Oh Vue Icons
      </a>
    </p>
  </footer>
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

.filter-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(700);

  .content {
    height: 100%;
  }
}

.search-form,
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
    color: color('text-dark');

    appearance: none;

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

.sort-menu-container {
  @include breakpoint-up('sm') {
    width: 100%;
    max-width: 200px;
  }
}

.sort-menu-trigger {
  @extend %reset-button-appearance;

  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  padding: spacing(200);

  border-radius: 4px;
  background-color: color('secondary-background');

  color: color('text-light');

  & {
    @include hover() {
      cursor: pointer;
      background-color: color('secondary-background-dark');
    }

    &[data-state='open'] {
      .icon {
        transform: rotateX(180deg);
      }
    }
  }

  .icon {
    margin-left: spacing(200);
  }
}

.sort-menu {
  display: flex;
  flex-direction: column;
  padding: spacing(100);
  border-radius: 4px;
  background-color: color('secondary-background');

  .item {
    display: inline-block;
    padding: spacing(200) spacing(300);

    font-size: text('md');
    font-family: inherit;
    color: color('text-light');

    @include hover($not: '[data-disabled="true"]') {
      cursor: pointer;
      background-color: color('secondary-background-dark');
    }

    &[data-disabled='true'] {
      color: color('text-light', 0.5);
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

.footer {
  width: 100%;

  padding: spacing(700);
  margin-top: spacing(700);
  background-color: color('secondary-background');

  font-size: text('sm');
  text-align: center;
  color: color('text-light', 0.8);

  .link {
    color: inherit;
  }
}
</style>
