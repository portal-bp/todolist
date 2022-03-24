import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITodoListItem, TodoListItem } from '../todo-list-item.model';
import { TodoListItemService } from '../service/todo-list-item.service';

import { TodoListItemRoutingResolveService } from './todo-list-item-routing-resolve.service';

describe('TodoListItem routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TodoListItemRoutingResolveService;
  let service: TodoListItemService;
  let resultTodoListItem: ITodoListItem | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(TodoListItemRoutingResolveService);
    service = TestBed.inject(TodoListItemService);
    resultTodoListItem = undefined;
  });

  describe('resolve', () => {
    it('should return ITodoListItem returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodoListItem = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTodoListItem).toEqual({ id: 123 });
    });

    it('should return new ITodoListItem if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodoListItem = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTodoListItem).toEqual(new TodoListItem());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TodoListItem })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodoListItem = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTodoListItem).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
