import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITodoListItemShare } from '../todo-list-item-share.model';
import { TodoListItemShareService } from '../service/todo-list-item-share.service';

@Component({
  templateUrl: './todo-list-item-share-delete-dialog.component.html',
})
export class TodoListItemShareDeleteDialogComponent {
  todoListItemShare?: ITodoListItemShare;

  constructor(protected todoListItemShareService: TodoListItemShareService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.todoListItemShareService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
