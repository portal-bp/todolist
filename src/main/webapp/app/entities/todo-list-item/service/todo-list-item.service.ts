import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITodoListItem, getTodoListItemIdentifier } from '../todo-list-item.model';

export type EntityResponseType = HttpResponse<ITodoListItem>;
export type EntityArrayResponseType = HttpResponse<ITodoListItem[]>;

@Injectable({ providedIn: 'root' })
export class TodoListItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/todo-list-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(todoListItem: ITodoListItem): Observable<EntityResponseType> {
    return this.http.post<ITodoListItem>(this.resourceUrl, todoListItem, { observe: 'response' });
  }

  update(todoListItem: ITodoListItem): Observable<EntityResponseType> {
    return this.http.put<ITodoListItem>(`${this.resourceUrl}/${getTodoListItemIdentifier(todoListItem) as number}`, todoListItem, {
      observe: 'response',
    });
  }

  partialUpdate(todoListItem: ITodoListItem): Observable<EntityResponseType> {
    return this.http.patch<ITodoListItem>(`${this.resourceUrl}/${getTodoListItemIdentifier(todoListItem) as number}`, todoListItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITodoListItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any, todoListId?: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    if (!todoListId) {
      return this.http.get<ITodoListItem[]>(this.resourceUrl, { params: options, observe: 'response' });
    }
    return this.http.get<ITodoListItem[]>(`${this.resourceUrl}/list/${todoListId}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTodoListItemToCollectionIfMissing(
    todoListItemCollection: ITodoListItem[],
    ...todoListItemsToCheck: (ITodoListItem | null | undefined)[]
  ): ITodoListItem[] {
    const todoListItems: ITodoListItem[] = todoListItemsToCheck.filter(isPresent);
    if (todoListItems.length > 0) {
      const todoListItemCollectionIdentifiers = todoListItemCollection.map(
        todoListItemItem => getTodoListItemIdentifier(todoListItemItem)!
      );
      const todoListItemsToAdd = todoListItems.filter(todoListItemItem => {
        const todoListItemIdentifier = getTodoListItemIdentifier(todoListItemItem);
        if (todoListItemIdentifier == null || todoListItemCollectionIdentifiers.includes(todoListItemIdentifier)) {
          return false;
        }
        todoListItemCollectionIdentifiers.push(todoListItemIdentifier);
        return true;
      });
      return [...todoListItemsToAdd, ...todoListItemCollection];
    }
    return todoListItemCollection;
  }
}
