import { createMatchesForSearch } from '@/utils/search';
import { ComputedRef, MaybeRef, computed, reactive, ref, toValue } from 'vue';

const randomString = () => (Math.random() * 36000).toString(36).substring(4);

const randomId = () =>
  [randomString(), randomString(), randomString(), randomString()].join('-');

export type Todo = {
  id: string;
  completed: boolean;
  description: string;
  dueAt?: string;
  createdAt: string;
  concludedAt?: string;
};

const createDefault = (
  length: number,
  data?: Partial<Todo> | ((index: number) => Partial<Todo>),
): Todo[] =>
  Array.from({ length }).map((_, index) => {
    const _data = data && typeof data === 'function' ? data(index) : data;

    const date = !_data
      ? new Date()
      : new Date(_data.dueAt || _data.createdAt || '').toLocaleDateString();

    return {
      id: randomId(),
      completed: false,
      description: `${_data && _data.dueAt ? 'DUE' : 'NDA'}(${
        index + 1
      }) ${date} Nulla duis fugiat aute non veniam aliquip laboris dolore consequat velit do ad.`,
      createdAt: new Date().toISOString(),
      ..._data,
    };
  });

const completed = createDefault(5, { completed: true }),
  uncompleted = [
    ...createDefault(7, (index: number) => ({
      dueAt: ((index + 1) % 2 === 0
        ? new Date(2023, 7, index + 1)
        : new Date()
      ).toISOString(),
    })),
    ...createDefault(3, (index: number) => ({
      createdAt: new Date(2023, 6, index + 1).toISOString(),
    })),
  ];

export const useTodos = () => {
  const todos = {
    completed: ref<Todo[]>(completed),
    uncompleted: ref<Todo[]>(uncompleted),
  };

  const add = (description: string) => {
    todos.uncompleted.value.push({
      id: randomId(),
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  };

  const remove = (list: keyof typeof todos, id: string): Todo | undefined => {
    const todo = todos[list].value.find((todo) => todo.id === id);
    if (!todo) return;

    todos[list].value = todos[list].value.filter((todo) => todo.id !== id);

    return todo;
  };

  const complete = (id: string) => {
    const todo = remove('uncompleted', id);
    if (!todo) return;

    todos.completed.value.push({
      ...todo,
      completed: true,
      concludedAt: new Date().toISOString(),
    });
  };

  const uncomplete = (id: string) => {
    const todo = remove('completed', id);
    if (!todo) return;

    todos.uncompleted.value.push({
      ...todo,
      completed: false,
      concludedAt: undefined,
    });
  };

  return {
    list: todos,

    add,
    remove,
    complete,
    uncomplete,
  };
};

export type TodosFilterSortByKeys =
  | 'recent'
  | 'recently-added'
  | 'older'
  | 'A-Z'
  | 'Z-A';

export type TodosFilter = {
  search?: string;
  sortBy?: TodosFilterSortByKeys;
};

export const useTodosFilter = (list: MaybeRef<Todo[]>, filter: TodosFilter) => {
  const hasFilter = () => !!filter.search || !!filter.sortBy;

  const time = (date: string) => new Date(date).getTime();

  const sortByHandlers = {
    recent: (current: Todo, next: Todo) => {
      {
        /**
         * Todos without `dueAt` remains at top.
         */
        if (!current.dueAt && !next.dueAt)
          return time(current.createdAt) > time(next.createdAt) ? 1 : -1;

        if (!next.dueAt) return 1;
        if (!current.dueAt) return -1;
      }

      /**
       * Todos with `dueAt` are ordered ASC.
       */
      return time(current.dueAt) > time(next.dueAt) ? 1 : -1;
    },
    'A-Z': (current: Todo, next: Todo) =>
      current.description > next.description ? 1 : -1,
    'Z-A': (current: Todo, next: Todo) =>
      current.description > next.description ? -1 : 1,
    'recently-added': (current: Todo, next: Todo) =>
      time(current.createdAt) > time(next.createdAt) ? -1 : 1,
    older: (current: Todo, next: Todo) =>
      time(current.createdAt) > time(next.createdAt) ? 1 : -1,
  };

  const filteredTodos = computed(() => {
    if (!hasFilter()) return toValue(list);

    let result = [...toValue(list)];

    if (filter.search) {
      const matches = createMatchesForSearch(filter.search);
      result = result.filter((todo) => matches(todo.description));
    }

    if (filter.sortBy) {
      if (!(filter.sortBy in sortByHandlers))
        throw new Error(`The sorting "${filter.sortBy}" does not exists!`);

      result.sort(sortByHandlers[filter.sortBy]);
    }

    return result;
  });

  return filteredTodos;
};
