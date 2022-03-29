import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITodoListItemShare } from '../todo-list-item-share.model';
import { TodoListItemShareService } from '../service/todo-list-item-share.service';
import { TodoListItemShareDeleteDialogComponent } from '../delete/todo-list-item-share-delete-dialog.component';

@Component({
  selector: 'jhi-todo-list-item-share',
  templateUrl: './todo-list-item-share.component.html',
})
export class TodoListItemShareComponent implements OnInit {
  todoListItemShares?: ITodoListItemShare[];
  isLoading = false;

  constructor(protected todoListItemShareService: TodoListItemShareService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.todoListItemShareService.query().subscribe({
      next: (res: HttpResponse<ITodoListItemShare[]>) => {
        this.isLoading = false;
        this.todoListItemShares = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITodoListItemShare): number {
    return item.id!;
  }

  delete(todoListItemShare: ITodoListItemShare): void {
    const modalRef = this.modalService.open(TodoListItemShareDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.todoListItemShare = todoListItemShare;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
