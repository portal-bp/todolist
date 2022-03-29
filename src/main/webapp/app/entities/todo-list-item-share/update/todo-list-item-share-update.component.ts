import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITodoListItemShare, TodoListItemShare } from '../todo-list-item-share.model';
import { TodoListItemShareService } from '../service/todo-list-item-share.service';
import { ITodoListItem } from 'app/entities/todo-list-item/todo-list-item.model';
import { TodoListItemService } from 'app/entities/todo-list-item/service/todo-list-item.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-todo-list-item-share-update',
  templateUrl: './todo-list-item-share-update.component.html',
})
export class TodoListItemShareUpdateComponent implements OnInit {
  isSaving = false;

  todoListItemsCollection: ITodoListItem[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    todoListItem: [],
    user: [],
  });

  constructor(
    protected todoListItemShareService: TodoListItemShareService,
    protected todoListItemService: TodoListItemService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todoListItemShare }) => {
      this.updateForm(todoListItemShare);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const todoListItemShare = this.createFromForm();
    if (todoListItemShare.id !== undefined) {
      this.subscribeToSaveResponse(this.todoListItemShareService.update(todoListItemShare));
    } else {
      this.subscribeToSaveResponse(this.todoListItemShareService.create(todoListItemShare));
    }
  }

  trackTodoListItemById(index: number, item: ITodoListItem): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITodoListItemShare>>): void {
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

  protected updateForm(todoListItemShare: ITodoListItemShare): void {
    this.editForm.patchValue({
      id: todoListItemShare.id,
      todoListItem: todoListItemShare.todoListItem,
      user: todoListItemShare.user,
    });

    this.todoListItemsCollection = this.todoListItemService.addTodoListItemToCollectionIfMissing(
      this.todoListItemsCollection,
      todoListItemShare.todoListItem
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, todoListItemShare.user);
  }

  protected loadRelationshipsOptions(): void {
    this.todoListItemService
      .query({ filter: 'todolistitemshare-is-null' })
      .pipe(map((res: HttpResponse<ITodoListItem[]>) => res.body ?? []))
      .pipe(
        map((todoListItems: ITodoListItem[]) =>
          this.todoListItemService.addTodoListItemToCollectionIfMissing(todoListItems, this.editForm.get('todoListItem')!.value)
        )
      )
      .subscribe((todoListItems: ITodoListItem[]) => (this.todoListItemsCollection = todoListItems));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ITodoListItemShare {
    return {
      ...new TodoListItemShare(),
      id: this.editForm.get(['id'])!.value,
      todoListItem: this.editForm.get(['todoListItem'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
