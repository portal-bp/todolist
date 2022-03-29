import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITodoListItemShare } from '../todo-list-item-share.model';

@Component({
  selector: 'jhi-todo-list-item-share-detail',
  templateUrl: './todo-list-item-share-detail.component.html',
})
export class TodoListItemShareDetailComponent implements OnInit {
  todoListItemShare: ITodoListItemShare | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todoListItemShare }) => {
      this.todoListItemShare = todoListItemShare;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
