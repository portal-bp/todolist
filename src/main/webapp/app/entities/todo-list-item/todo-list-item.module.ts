import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TodoListItemComponent } from './list/todo-list-item.component';
import { TodoListItemDetailComponent } from './detail/todo-list-item-detail.component';
import { TodoListItemUpdateComponent } from './update/todo-list-item-update.component';
import { TodoListItemDeleteDialogComponent } from './delete/todo-list-item-delete-dialog.component';
import { TodoListItemRoutingModule } from './route/todo-list-item-routing.module';

@NgModule({
  imports: [SharedModule, TodoListItemRoutingModule],
  declarations: [TodoListItemComponent, TodoListItemDetailComponent, TodoListItemUpdateComponent, TodoListItemDeleteDialogComponent],
  entryComponents: [TodoListItemDeleteDialogComponent],
})
export class TodoListItemModule {}
