import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITodoListItem } from '../todo-list-item.model';

@Component({
  selector: 'jhi-todo-list-item-detail',
  templateUrl: './todo-list-item-detail.component.html',
})
export class TodoListItemDetailComponent implements OnInit {
  todoListItem: ITodoListItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todoListItem }) => {
      this.todoListItem = todoListItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
