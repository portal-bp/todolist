import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITodoListItemShare, TodoListItemShare } from '../todo-list-item-share.model';
import { TodoListItemShareService } from '../service/todo-list-item-share.service';

import { TodoListItemShareRoutingResolveService } from './todo-list-item-share-routing-resolve.service';

describe('TodoListItemShare routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TodoListItemShareRoutingResolveService;
  let service: TodoListItemShareService;
  let resultTodoListItemShare: ITodoListItemShare | undefined;

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
    routingResolveService = TestBed.inject(TodoListItemShareRoutingResolveService);
    service = TestBed.inject(TodoListItemShareService);
    resultTodoListItemShare = undefined;
  });

  describe('resolve', () => {
    it('should return ITodoListItemShare returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodoListItemShare = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTodoListItemShare).toEqual({ id: 123 });
    });

    it('should return new ITodoListItemShare if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodoListItemShare = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTodoListItemShare).toEqual(new TodoListItemShare());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TodoListItemShare })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodoListItemShare = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTodoListItemShare).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
