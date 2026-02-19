import { Component, computed, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { Todo, todoCategory } from './todo';
import { TodoCardComponent } from './todo-card.component';
import { TodoService } from './todo.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
/**
 * A component that displays a list of users, either as a grid
 * of cards or as a vertical list.
 *
 * The component supports local filtering by name and/or company,
 * and remote filtering (i.e., filtering by the server) by
 * role and/or age. These choices are fairly arbitrary here,
 * but in "real" projects you want to think about where it
 * makes the most sense to do the filtering.
 */
@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: [],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatListModule,
    RouterLink,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class TodoListComponent {
  // TodoService the `TodoService` used to get todos from the server
  private TodoService = inject(TodoService);
  // snackBar the `MatSnackBar` used to display feedback
  private snackBar = inject(MatSnackBar);

  todo_id = signal<string | undefined>(undefined);
  todoOwner = signal<string | undefined>(undefined);
  todoStatus = signal<boolean | undefined>(undefined);
  todoBody = signal<string | undefined>(undefined);
  todoCategory = signal<string | undefined>(undefined);

  viewType = signal<'card' | 'list'>('card');

  errMsg = signal<string | undefined>(undefined);

  private todoOwner$ = toObservable(this.todoOwner);
  private todoStatus$ = toObservable(this.todoStatus);

  // We ultimately `toSignal` this to be able to access it synchronously, but we do all the RXJS operations
  // "inside" the `toSignal()` call processing and transforming the observables there.
  serverFilteredTodos =
    toSignal(
      combineLatest([this.todoOwner$,]).pipe(
        switchMap(([owner]) =>
          this.TodoService.getTodos({
            owner,
          })
        )));

        // `catchError` is used to handle errors that might occur in the pipeline. In this case `userService.getUsers()`
        // can return errors if, for example, the server is down or returns an error. This catches those errors, and
        // sets the `errMsg` signal, which allows error messages to be displayed.
        catchError((err) => {
          if (!(err.error instanceof ErrorEvent)) {
            this.errMsg.set(
              `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`
            );
          }

          this.snackBar.open(this.errMsg(), 'OK', { duration: 6000 });
          // `catchError` needs to return the same type. `of` makes an observable of the same type, and makes the array still empty
          return of<Todo[]>([]);
        }):

  // No need for fancy RXJS stuff. We do the fancy RXJS stuff where we call `toSignal`, i.e., up in
  // the definition of `serverFilteredUsers` above.
  // `computed()` takes the value of one or more signals (`serverFilteredUsers` in this case) and
  // _computes_ the value of a new signal (`filteredUsers`). Angular recognizes when any signals
  // in the function passed to `computed()` change, and will then call that function to generate
  // the new value of the computed signal.
  // In this case, whenever `serverFilteredUsers` changes (e.g., because we change `userName`), then `filteredUsers`
  // will be updated by rerunning the function we're passing to `computed()`.
  filteredTodos = computed(() => {
    const serverFilteredTodos = this.filteredTodos();
    return this.TodoService.filterTodo(serverFilteredTodos, {
      owner: this.todoOwner(),
    });
  });
}
