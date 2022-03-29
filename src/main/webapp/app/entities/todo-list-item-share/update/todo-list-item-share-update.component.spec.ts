import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TodoListItemShareService } from '../service/todo-list-item-share.service';
import { ITodoListItemShare, TodoListItemShare } from '../todo-list-item-share.model';
import { ITodoListItem } from 'app/entities/todo-list-item/todo-list-item.model';
import { TodoListItemService } from 'app/entities/todo-list-item/service/todo-list-item.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { TodoListItemShareUpdateComponent } from './todo-list-item-share-update.component';

describe('TodoListItemShare Management Update Component', () => {
  let comp: TodoListItemShareUpdateComponent;
  let fixture: ComponentFixture<TodoListItemShareUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let todoListItemShareService: TodoListItemShareService;
  let todoListItemService: TodoListItemService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TodoListItemShareUpdateComponent],
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
      .overrideTemplate(TodoListItemShareUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodoListItemShareUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    todoListItemShareService = TestBed.inject(TodoListItemShareService);
    todoListItemService = TestBed.inject(TodoListItemService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call todoListItem query and add missing value', () => {
      const todoListItemShare: ITodoListItemShare = { id: 456 };
      const todoListItem: ITodoListItem = { id: 99908 };
      todoListItemShare.todoListItem = todoListItem;

      const todoListItemCollection: ITodoListItem[] = [{ id: 61083 }];
      jest.spyOn(todoListItemService, 'query').mockReturnValue(of(new HttpResponse({ body: todoListItemCollection })));
      const expectedCollection: ITodoListItem[] = [todoListItem, ...todoListItemCollection];
      jest.spyOn(todoListItemService, 'addTodoListItemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ todoListItemShare });
      comp.ngOnInit();

      expect(todoListItemService.query).toHaveBeenCalled();
      expect(todoListItemService.addTodoListItemToCollectionIfMissing).toHaveBeenCalledWith(todoListItemCollection, todoListItem);
      expect(comp.todoListItemsCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const todoListItemShare: ITodoListItemShare = { id: 456 };
      const user: IUser = { id: 62937 };
      todoListItemShare.user = user;

      const userCollection: IUser[] = [{ id: 49296 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ todoListItemShare });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const todoListItemShare: ITodoListItemShare = { id: 456 };
      const todoListItem: ITodoListItem = { id: 16547 };
      todoListItemShare.todoListItem = todoListItem;
      const user: IUser = { id: 92833 };
      todoListItemShare.user = user;

      activatedRoute.data = of({ todoListItemShare });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(todoListItemShare));
      expect(comp.todoListItemsCollection).toContain(todoListItem);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TodoListItemShare>>();
      const todoListItemShare = { id: 123 };
      jest.spyOn(todoListItemShareService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoListItemShare });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todoListItemShare }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(todoListItemShareService.update).toHaveBeenCalledWith(todoListItemShare);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TodoListItemShare>>();
      const todoListItemShare = new TodoListItemShare();
      jest.spyOn(todoListItemShareService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoListItemShare });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todoListItemShare }));
      saveSubject.complete();

      // THEN
      expect(todoListItemShareService.create).toHaveBeenCalledWith(todoListItemShare);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TodoListItemShare>>();
      const todoListItemShare = { id: 123 };
      jest.spyOn(todoListItemShareService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoListItemShare });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(todoListItemShareService.update).toHaveBeenCalledWith(todoListItemShare);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTodoListItemById', () => {
      it('Should return tracked TodoListItem primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTodoListItemById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
