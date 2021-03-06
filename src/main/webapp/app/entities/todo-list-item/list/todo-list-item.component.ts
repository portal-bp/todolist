import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITodoListItem } from '../todo-list-item.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { TodoListItemService } from '../service/todo-list-item.service';
import { TodoListItemDeleteDialogComponent } from '../delete/todo-list-item-delete-dialog.component';

@Component({
  selector: 'jhi-todo-list-item',
  templateUrl: './todo-list-item.component.html',
})
export class TodoListItemComponent implements OnInit {
  todoListItems?: ITodoListItem[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  todoListId?: number = undefined;

  constructor(
    protected todoListItemService: TodoListItemService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean, todoListId?: number): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.todoListItemService
      .query(
        {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        todoListId
      )
      .subscribe({
        next: (res: HttpResponse<ITodoListItem[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: ITodoListItem): number {
    return item.id!;
  }

  delete(todoListItem: ITodoListItem): void {
    const modalRef = this.modalService.open(TodoListItemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.todoListItem = todoListItem;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      this.activatedRoute.params.subscribe(parameter => {
        this.todoListId = parameter['todoListId'];
        const page = params.get('page');
        const pageNumber = +(page ?? 1);
        const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
        const predicate = sort[0];
        const ascending = sort[1] === ASC;
        if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
          this.predicate = predicate;
          this.ascending = ascending;
          this.loadPage(pageNumber, true, this.todoListId);
        }
      });
    });
  }

  protected onSuccess(data: ITodoListItem[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/todo-list-item'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.todoListItems = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
