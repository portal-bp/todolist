import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITodoListItemShare, TodoListItemShare } from '../todo-list-item-share.model';

import { TodoListItemShareService } from './todo-list-item-share.service';

describe('TodoListItemShare Service', () => {
  let service: TodoListItemShareService;
  let httpMock: HttpTestingController;
  let elemDefault: ITodoListItemShare;
  let expectedResult: ITodoListItemShare | ITodoListItemShare[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TodoListItemShareService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a TodoListItemShare', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TodoListItemShare()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TodoListItemShare', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TodoListItemShare', () => {
      const patchObject = Object.assign({}, new TodoListItemShare());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TodoListItemShare', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a TodoListItemShare', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTodoListItemShareToCollectionIfMissing', () => {
      it('should add a TodoListItemShare to an empty array', () => {
        const todoListItemShare: ITodoListItemShare = { id: 123 };
        expectedResult = service.addTodoListItemShareToCollectionIfMissing([], todoListItemShare);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(todoListItemShare);
      });

      it('should not add a TodoListItemShare to an array that contains it', () => {
        const todoListItemShare: ITodoListItemShare = { id: 123 };
        const todoListItemShareCollection: ITodoListItemShare[] = [
          {
            ...todoListItemShare,
          },
          { id: 456 },
        ];
        expectedResult = service.addTodoListItemShareToCollectionIfMissing(todoListItemShareCollection, todoListItemShare);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TodoListItemShare to an array that doesn't contain it", () => {
        const todoListItemShare: ITodoListItemShare = { id: 123 };
        const todoListItemShareCollection: ITodoListItemShare[] = [{ id: 456 }];
        expectedResult = service.addTodoListItemShareToCollectionIfMissing(todoListItemShareCollection, todoListItemShare);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(todoListItemShare);
      });

      it('should add only unique TodoListItemShare to an array', () => {
        const todoListItemShareArray: ITodoListItemShare[] = [{ id: 123 }, { id: 456 }, { id: 64822 }];
        const todoListItemShareCollection: ITodoListItemShare[] = [{ id: 123 }];
        expectedResult = service.addTodoListItemShareToCollectionIfMissing(todoListItemShareCollection, ...todoListItemShareArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const todoListItemShare: ITodoListItemShare = { id: 123 };
        const todoListItemShare2: ITodoListItemShare = { id: 456 };
        expectedResult = service.addTodoListItemShareToCollectionIfMissing([], todoListItemShare, todoListItemShare2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(todoListItemShare);
        expect(expectedResult).toContain(todoListItemShare2);
      });

      it('should accept null and undefined values', () => {
        const todoListItemShare: ITodoListItemShare = { id: 123 };
        expectedResult = service.addTodoListItemShareToCollectionIfMissing([], null, todoListItemShare, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(todoListItemShare);
      });

      it('should return initial array if no TodoListItemShare is added', () => {
        const todoListItemShareCollection: ITodoListItemShare[] = [{ id: 123 }];
        expectedResult = service.addTodoListItemShareToCollectionIfMissing(todoListItemShareCollection, undefined, null);
        expect(expectedResult).toEqual(todoListItemShareCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
