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
      {
        path: 'todo-list-item',
        data: { pageTitle: 'todolistApp.todoListItem.home.title' },
        loadChildren: () => import('./todo-list-item/todo-list-item.module').then(m => m.TodoListItemModule),
      },
      {
        path: 'todo-list-item-share',
        data: { pageTitle: 'todolistApp.todoListItemShare.home.title' },
        loadChildren: () => import('./todo-list-item-share/todo-list-item-share.module').then(m => m.TodoListItemShareModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
