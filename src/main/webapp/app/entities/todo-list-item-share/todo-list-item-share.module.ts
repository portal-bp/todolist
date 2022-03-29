import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TodoListItemShareComponent } from './list/todo-list-item-share.component';
import { TodoListItemShareDetailComponent } from './detail/todo-list-item-share-detail.component';
import { TodoListItemShareUpdateComponent } from './update/todo-list-item-share-update.component';
import { TodoListItemShareDeleteDialogComponent } from './delete/todo-list-item-share-delete-dialog.component';
import { TodoListItemShareRoutingModule } from './route/todo-list-item-share-routing.module';

@NgModule({
  imports: [SharedModule, TodoListItemShareRoutingModule],
  declarations: [
    TodoListItemShareComponent,
    TodoListItemShareDetailComponent,
    TodoListItemShareUpdateComponent,
    TodoListItemShareDeleteDialogComponent,
  ],
  entryComponents: [TodoListItemShareDeleteDialogComponent],
})
export class TodoListItemShareModule {}
