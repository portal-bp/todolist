import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITodoListItem, TodoListItem } from '../todo-list-item.model';
import { TodoListItemService } from '../service/todo-list-item.service';
import { ITodoList } from 'app/entities/todo-list/todo-list.model';
import { TodoListService } from 'app/entities/todo-list/service/todo-list.service';

@Component({
  selector: 'jhi-todo-list-item-update',
  templateUrl: './todo-list-item-update.component.html',
})
export class TodoListItemUpdateComponent implements OnInit {
  isSaving = false;

  todoListsSharedCollection: ITodoList[] = [];

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.required, Validators.maxLength(256)]],
    done: [],
    todoList: [null, Validators.required],
  });

  constructor(
    protected todoListItemService: TodoListItemService,
    protected todoListService: TodoListService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todoListItem }) => {
      this.updateForm(todoListItem);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const todoListItem = this.createFromForm();
    if (todoListItem.id !== undefined) {
      this.subscribeToSaveResponse(this.todoListItemService.update(todoListItem));
    } else {
      this.subscribeToSaveResponse(this.todoListItemService.create(todoListItem));
    }
  }

  trackTodoListById(index: number, item: ITodoList): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITodoListItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(todoListItem: ITodoListItem): void {
    this.editForm.patchValue({
      id: todoListItem.id,
      description: todoListItem.description,
      done: todoListItem.done,
      todoList: todoListItem.todoList,
    });

    this.todoListsSharedCollection = this.todoListService.addTodoListToCollectionIfMissing(
      this.todoListsSharedCollection,
      todoListItem.todoList
    );
  }

  protected loadRelationshipsOptions(): void {
    this.todoListService
      .query()
      .pipe(map((res: HttpResponse<ITodoList[]>) => res.body ?? []))
      .pipe(
        map((todoLists: ITodoList[]) =>
          this.todoListService.addTodoListToCollectionIfMissing(todoLists, this.editForm.get('todoList')!.value)
        )
      )
      .subscribe((todoLists: ITodoList[]) => (this.todoListsSharedCollection = todoLists));
  }

  protected createFromForm(): ITodoListItem {
    return {
      ...new TodoListItem(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      done: this.editForm.get(['done'])!.value,
      todoList: this.editForm.get(['todoList'])!.value,
    };
  }
}
