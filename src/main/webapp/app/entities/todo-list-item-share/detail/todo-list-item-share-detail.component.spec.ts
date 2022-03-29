import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TodoListItemShareDetailComponent } from './todo-list-item-share-detail.component';

describe('TodoListItemShare Management Detail Component', () => {
  let comp: TodoListItemShareDetailComponent;
  let fixture: ComponentFixture<TodoListItemShareDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoListItemShareDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ todoListItemShare: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TodoListItemShareDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TodoListItemShareDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load todoListItemShare on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.todoListItemShare).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
