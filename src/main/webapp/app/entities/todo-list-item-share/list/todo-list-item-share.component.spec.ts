import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TodoListItemShareService } from '../service/todo-list-item-share.service';

import { TodoListItemShareComponent } from './todo-list-item-share.component';

describe('TodoListItemShare Management Component', () => {
  let comp: TodoListItemShareComponent;
  let fixture: ComponentFixture<TodoListItemShareComponent>;
  let service: TodoListItemShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TodoListItemShareComponent],
    })
      .overrideTemplate(TodoListItemShareComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodoListItemShareComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TodoListItemShareService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.todoListItemShares?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
