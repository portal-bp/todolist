import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITodoListItemShare, getTodoListItemShareIdentifier } from '../todo-list-item-share.model';

export type EntityResponseType = HttpResponse<ITodoListItemShare>;
export type EntityArrayResponseType = HttpResponse<ITodoListItemShare[]>;

@Injectable({ providedIn: 'root' })
export class TodoListItemShareService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/todo-list-item-shares');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(todoListItemShare: ITodoListItemShare): Observable<EntityResponseType> {
    return this.http.post<ITodoListItemShare>(this.resourceUrl, todoListItemShare, { observe: 'response' });
  }

  update(todoListItemShare: ITodoListItemShare): Observable<EntityResponseType> {
    return this.http.put<ITodoListItemShare>(
      `${this.resourceUrl}/${getTodoListItemShareIdentifier(todoListItemShare) as number}`,
      todoListItemShare,
      { observe: 'response' }
    );
  }

  partialUpdate(todoListItemShare: ITodoListItemShare): Observable<EntityResponseType> {
    return this.http.patch<ITodoListItemShare>(
      `${this.resourceUrl}/${getTodoListItemShareIdentifier(todoListItemShare) as number}`,
      todoListItemShare,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITodoListItemShare>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITodoListItemShare[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTodoListItemShareToCollectionIfMissing(
    todoListItemShareCollection: ITodoListItemShare[],
    ...todoListItemSharesToCheck: (ITodoListItemShare | null | undefined)[]
  ): ITodoListItemShare[] {
    const todoListItemShares: ITodoListItemShare[] = todoListItemSharesToCheck.filter(isPresent);
    if (todoListItemShares.length > 0) {
      const todoListItemShareCollectionIdentifiers = todoListItemShareCollection.map(
        todoListItemShareItem => getTodoListItemShareIdentifier(todoListItemShareItem)!
      );
      const todoListItemSharesToAdd = todoListItemShares.filter(todoListItemShareItem => {
        const todoListItemShareIdentifier = getTodoListItemShareIdentifier(todoListItemShareItem);
        if (todoListItemShareIdentifier == null || todoListItemShareCollectionIdentifiers.includes(todoListItemShareIdentifier)) {
          return false;
        }
        todoListItemShareCollectionIdentifiers.push(todoListItemShareIdentifier);
        return true;
      });
      return [...todoListItemSharesToAdd, ...todoListItemShareCollection];
    }
    return todoListItemShareCollection;
  }
}
