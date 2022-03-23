import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'todo-list',
        data: { pageTitle: 'todolistApp.todoList.home.title' },
        loadChildren: () => import('./todo-list/todo-list.module').then(m => m.TodoListModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
