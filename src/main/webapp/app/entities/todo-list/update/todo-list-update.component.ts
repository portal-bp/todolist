import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITodoList, TodoList } from '../todo-list.model';
import { TodoListService } from '../service/todo-list.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-todo-list-update',
  templateUrl: './todo-list-update.component.html',
})
export class TodoListUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required, Validators.maxLength(128)]],
  });

  constructor(
    protected todoListService: TodoListService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todoList }) => {
      this.updateForm(todoList);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const todoList = this.createFromForm();
    if (todoList.id !== undefined) {
      this.subscribeToSaveResponse(this.todoListService.update(todoList));
    } else {
      this.subscribeToSaveResponse(this.todoListService.create(todoList));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITodoList>>): void {
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

  protected updateForm(todoList: ITodoList): void {
    this.editForm.patchValue({
      id: todoList.id,
      title: todoList.title,
      user: todoList.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, todoList.user);
  }

  protected createFromForm(): ITodoList {
    return {
      ...new TodoList(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
    };
  }
}
