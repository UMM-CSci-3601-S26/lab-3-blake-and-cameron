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
import { TodoService } from './todo.service';

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
  // userService the `UserService` used to get users from the server
  private TodoService = inject(TodoService);
  // snackBar the `MatSnackBar` used to display feedback
  private snackBar = inject(MatSnackBar);

  todoOwner = signal<string | undefined>(undefined);
  todoStatus = signal<boolean | undefined>(undefined);
  todoBody = signal<string | undefined>(undefined);
  todoCategory = signal<string | undefined>(undefined);

  // viewType = signal<'card' | 'list'>('card');

  errMsg = signal<string | undefined>(undefined);

  // The `Observable`s used in the definition of `serverFilteredUsers` below need
  // observables to react to, i.e., they need to know what kinds of changes to respond to.
  // We want to do the age and role filtering on the server side, so if either of those
  // text fields change we want to re-run the filtering. That means we have to convert both
  // of those _signals_ to _observables_ using `toObservable()`. Those are then used in the
  // definition of `serverFilteredUsers` below to trigger updates to the `Observable` there.
  //private TodoRole$ = toObservable(this.userRole);
  //private TodoAge$ = toObservable(this.userAge);

  // We ultimately `toSignal` this to be able to access it synchronously, but we do all the RXJS operations
  // "inside" the `toSignal()` call processing and transforming the observables there.
  // serverFilteredUsers =
  //    // This `combineLatest` call takes the most recent values from these two observables (both built from
  // signals as described above) and passes them into the following `.pipe()` call. If either of the
  // `userRole` or `userAge` signals change (because their text fields get updated), then that will trigger
  //     // the corresponding `userRole$` and/or `userAge$` observables to change, which will cause `combineLatest()`
  // to send a new pair down the pipe.
  // toSignal(
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
      category: this.todoCategory(),
    });
  });
}
