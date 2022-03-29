import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TodoListItemComponent } from '../list/todo-list-item.component';
import { TodoListItemDetailComponent } from '../detail/todo-list-item-detail.component';
import { TodoListItemUpdateComponent } from '../update/todo-list-item-update.component';
import { TodoListItemRoutingResolveService } from './todo-list-item-routing-resolve.service';

const todoListItemRoute: Routes = [
  {
    path: '',
    component: TodoListItemComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'list/:todoListId',
    component: TodoListItemComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TodoListItemDetailComponent,
    resolve: {
      todoListItem: TodoListItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TodoListItemUpdateComponent,
    resolve: {
      todoListItem: TodoListItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TodoListItemUpdateComponent,
    resolve: {
      todoListItem: TodoListItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(todoListItemRoute)],
  exports: [RouterModule],
})
export class TodoListItemRoutingModule {}
