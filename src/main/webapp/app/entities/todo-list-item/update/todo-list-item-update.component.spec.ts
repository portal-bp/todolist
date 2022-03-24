import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TodoListItemService } from '../service/todo-list-item.service';
import { ITodoListItem, TodoListItem } from '../todo-list-item.model';
import { ITodoList } from 'app/entities/todo-list/todo-list.model';
import { TodoListService } from 'app/entities/todo-list/service/todo-list.service';

import { TodoListItemUpdateComponent } from './todo-list-item-update.component';

describe('TodoListItem Management Update Component', () => {
  let comp: TodoListItemUpdateComponent;
  let fixture: ComponentFixture<TodoListItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let todoListItemService: TodoListItemService;
  let todoListService: TodoListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TodoListItemUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TodoListItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodoListItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    todoListItemService = TestBed.inject(TodoListItemService);
    todoListService = TestBed.inject(TodoListService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TodoList query and add missing value', () => {
      const todoListItem: ITodoListItem = { id: 456 };
      const todoList: ITodoList = { id: 28503 };
      todoListItem.todoList = todoList;

      const todoListCollection: ITodoList[] = [{ id: 83904 }];
      jest.spyOn(todoListService, 'query').mockReturnValue(of(new HttpResponse({ body: todoListCollection })));
      const additionalTodoLists = [todoList];
      const expectedCollection: ITodoList[] = [...additionalTodoLists, ...todoListCollection];
      jest.spyOn(todoListService, 'addTodoListToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ todoListItem });
      comp.ngOnInit();

      expect(todoListService.query).toHaveBeenCalled();
      expect(todoListService.addTodoListToCollectionIfMissing).toHaveBeenCalledWith(todoListCollection, ...additionalTodoLists);
      expect(comp.todoListsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const todoListItem: ITodoListItem = { id: 456 };
      const todoList: ITodoList = { id: 40425 };
      todoListItem.todoList = todoList;

      activatedRoute.data = of({ todoListItem });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(todoListItem));
      expect(comp.todoListsSharedCollection).toContain(todoList);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TodoListItem>>();
      const todoListItem = { id: 123 };
      jest.spyOn(todoListItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoListItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todoListItem }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(todoListItemService.update).toHaveBeenCalledWith(todoListItem);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TodoListItem>>();
      const todoListItem = new TodoListItem();
      jest.spyOn(todoListItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoListItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todoListItem }));
      saveSubject.complete();

      // THEN
      expect(todoListItemService.create).toHaveBeenCalledWith(todoListItem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TodoListItem>>();
      const todoListItem = { id: 123 };
      jest.spyOn(todoListItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoListItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(todoListItemService.update).toHaveBeenCalledWith(todoListItem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTodoListById', () => {
      it('Should return tracked TodoList primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTodoListById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
