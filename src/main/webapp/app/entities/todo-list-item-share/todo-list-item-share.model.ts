import { ITodoListItem } from 'app/entities/todo-list-item/todo-list-item.model';
import { IUser } from 'app/entities/user/user.model';

export interface ITodoListItemShare {
  id?: number;
  todoListItem?: ITodoListItem | null;
  user?: IUser | null;
}

export class TodoListItemShare implements ITodoListItemShare {
  constructor(public id?: number, public todoListItem?: ITodoListItem | null, public user?: IUser | null) {}
}

export function getTodoListItemShareIdentifier(todoListItemShare: ITodoListItemShare): number | undefined {
  return todoListItemShare.id;
}
