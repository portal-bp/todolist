import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITodoListItemShare, TodoListItemShare } from '../todo-list-item-share.model';
import { TodoListItemShareService } from '../service/todo-list-item-share.service';

@Injectable({ providedIn: 'root' })
export class TodoListItemShareRoutingResolveService implements Resolve<ITodoListItemShare> {
  constructor(protected service: TodoListItemShareService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITodoListItemShare> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((todoListItemShare: HttpResponse<TodoListItemShare>) => {
          if (todoListItemShare.body) {
            return of(todoListItemShare.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TodoListItemShare());
  }
}
