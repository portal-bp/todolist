import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TodoListItemShareComponent } from '../list/todo-list-item-share.component';
import { TodoListItemShareDetailComponent } from '../detail/todo-list-item-share-detail.component';
import { TodoListItemShareUpdateComponent } from '../update/todo-list-item-share-update.component';
import { TodoListItemShareRoutingResolveService } from './todo-list-item-share-routing-resolve.service';

const todoListItemShareRoute: Routes = [
  {
    path: '',
    component: TodoListItemShareComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TodoListItemShareDetailComponent,
    resolve: {
      todoListItemShare: TodoListItemShareRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TodoListItemShareUpdateComponent,
    resolve: {
      todoListItemShare: TodoListItemShareRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TodoListItemShareUpdateComponent,
    resolve: {
      todoListItemShare: TodoListItemShareRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(todoListItemShareRoute)],
  exports: [RouterModule],
})
export class TodoListItemShareRoutingModule {}
