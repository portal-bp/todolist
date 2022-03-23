import { IUser } from 'app/entities/user/user.model';

export interface ITodoList {
  id?: number;
  title?: string;
  user?: IUser;
}

export class TodoList implements ITodoList {
  constructor(public id?: number, public title?: string, public user?: IUser) {}
}

export function getTodoListIdentifier(todoList: ITodoList): number | undefined {
  return todoList.id;
}
