import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITodoListItem, TodoListItem } from '../todo-list-item.model';

import { TodoListItemService } from './todo-list-item.service';

describe('TodoListItem Service', () => {
  let service: TodoListItemService;
  let httpMock: HttpTestingController;
  let elemDefault: ITodoListItem;
  let expectedResult: ITodoListItem | ITodoListItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TodoListItemService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      description: 'AAAAAAA',
      done: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TodoListItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TodoListItem()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TodoListItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: 'BBBBBB',
          done: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TodoListItem', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
          done: true,
        },
        new TodoListItem()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TodoListItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: 'BBBBBB',
          done: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a TodoListItem', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTodoListItemToCollectionIfMissing', () => {
      it('should add a TodoListItem to an empty array', () => {
        const todoListItem: ITodoListItem = { id: 123 };
        expectedResult = service.addTodoListItemToCollectionIfMissing([], todoListItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(todoListItem);
      });

      it('should not add a TodoListItem to an array that contains it', () => {
        const todoListItem: ITodoListItem = { id: 123 };
        const todoListItemCollection: ITodoListItem[] = [
          {
            ...todoListItem,
          },
          { id: 456 },
        ];
        expectedResult = service.addTodoListItemToCollectionIfMissing(todoListItemCollection, todoListItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TodoListItem to an array that doesn't contain it", () => {
        const todoListItem: ITodoListItem = { id: 123 };
        const todoListItemCollection: ITodoListItem[] = [{ id: 456 }];
        expectedResult = service.addTodoListItemToCollectionIfMissing(todoListItemCollection, todoListItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(todoListItem);
      });

      it('should add only unique TodoListItem to an array', () => {
        const todoListItemArray: ITodoListItem[] = [{ id: 123 }, { id: 456 }, { id: 79595 }];
        const todoListItemCollection: ITodoListItem[] = [{ id: 123 }];
        expectedResult = service.addTodoListItemToCollectionIfMissing(todoListItemCollection, ...todoListItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const todoListItem: ITodoListItem = { id: 123 };
        const todoListItem2: ITodoListItem = { id: 456 };
        expectedResult = service.addTodoListItemToCollectionIfMissing([], todoListItem, todoListItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(todoListItem);
        expect(expectedResult).toContain(todoListItem2);
      });

      it('should accept null and undefined values', () => {
        const todoListItem: ITodoListItem = { id: 123 };
        expectedResult = service.addTodoListItemToCollectionIfMissing([], null, todoListItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(todoListItem);
      });

      it('should return initial array if no TodoListItem is added', () => {
        const todoListItemCollection: ITodoListItem[] = [{ id: 123 }];
        expectedResult = service.addTodoListItemToCollectionIfMissing(todoListItemCollection, undefined, null);
        expect(expectedResult).toEqual(todoListItemCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
