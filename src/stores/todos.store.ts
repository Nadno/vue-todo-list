import { reactive } from 'vue';

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

const createDefault = (length: number, data?: Partial<Todo>): Todo[] =>
  Array.from({ length }).map((_, index) => ({
    id: randomId(),
    completed: false,
    description: `${
      index + 1
    }. Nulla duis fugiat aute non veniam aliquip laboris dolore consequat velit do ad.`,
    createdAt: new Date().toISOString(),
    ...data,
  }));

const completed = createDefault(5, { completed: true }),
  uncompleted = createDefault(10);

export const useTodos = () => {
  const todos = reactive({
    completed: completed as Todo[],
    uncompleted: uncompleted as Todo[],
  });

  const add = (description: string) => {
    todos.uncompleted.push({
      id: randomId(),
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  };

  const remove = (list: keyof typeof todos, id: string): Todo | undefined => {
    const todo = todos[list].find((todo) => todo.id === id);
    if (!todo) return;

    todos[list] = todos[list].filter((todo) => todo.id !== id);

    return todo;
  };

  const complete = (id: string) => {
    const todo = remove('uncompleted', id);
    if (!todo) return;

    todos.completed.push({
      ...todo,
      completed: true,
      concludedAt: new Date().toISOString(),
    });
  };

  const uncomplete = (id: string) => {
    const todo = remove('completed', id);
    if (!todo) return;

    todos.uncompleted.push({
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
