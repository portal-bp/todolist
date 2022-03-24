import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITodoListItem } from '../todo-list-item.model';
import { TodoListItemService } from '../service/todo-list-item.service';

@Component({
  templateUrl: './todo-list-item-delete-dialog.component.html',
})
export class TodoListItemDeleteDialogComponent {
  todoListItem?: ITodoListItem;

  constructor(protected todoListItemService: TodoListItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.todoListItemService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
