import { ITodoList } from 'app/entities/todo-list/todo-list.model';

export interface ITodoListItem {
  id?: number;
  description?: string;
  done?: boolean | null;
  todoList?: ITodoList;
}

export class TodoListItem implements ITodoListItem {
  constructor(public id?: number, public description?: string, public done?: boolean | null, public todoList?: ITodoList) {
    this.done = this.done ?? false;
  }
}

export function getTodoListItemIdentifier(todoListItem: ITodoListItem): number | undefined {
  return todoListItem.id;
}
