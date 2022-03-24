import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TodoListItemDetailComponent } from './todo-list-item-detail.component';

describe('TodoListItem Management Detail Component', () => {
  let comp: TodoListItemDetailComponent;
  let fixture: ComponentFixture<TodoListItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoListItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ todoListItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TodoListItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TodoListItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load todoListItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.todoListItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
