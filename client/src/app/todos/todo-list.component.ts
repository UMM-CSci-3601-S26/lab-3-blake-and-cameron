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


@Component({
  selector: 'app-todo-list-component',
  standalone: true,
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    TodoCardComponent,
    MatListModule,
    RouterLink,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class TodoListComponent {


  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  todoOwner = signal<string | undefined>(undefined);
  todoCategory = signal<todoCategory | undefined>(undefined);
  todoStatus = signal<boolean | undefined>(undefined);
  todoBody = signal<string | undefined>(undefined);
  todoLimit = signal<number | undefined>(undefined);
  todoSortBy = signal<'owner' | 'status' | 'body' | 'category' | undefined>(undefined);
  todoSortOrder = signal<'asc' | 'desc' | undefined>(undefined);

  viewType = signal<'card' | 'list'>('card');

  errMsg = signal<string | undefined>(undefined);

  private todoCategory$ = toObservable(this.todoCategory);
  private todoStatus$ = toObservable(this.todoStatus);
  private todoLimit$ = toObservable(this.todoLimit);
  private todoBody$ = toObservable(this.todoBody);
  private todoSortBy$ = toObservable(this.todoSortBy);
  private todoSortOrder$ = toObservable(this.todoSortOrder);
  private todoOwner$ = toObservable(this.todoOwner);

  serverFilteredTodos = toSignal(
    combineLatest([this.todoCategory$, this.todoStatus$, this.todoLimit$, this.todoBody$, this.todoSortBy$, this.todoSortOrder$, this.todoOwner$]).pipe(
      switchMap(([category, status, limit, body, sortBy, sortOrder, owner]) =>
        this.todoService.getTodos({
          category,
          status,
          limit,
          body,
          sortBy,
          sortOrder,
          owner
        })
      ),

      catchError((err) => {
        if (!(err.error instanceof ErrorEvent)) {
          this.errMsg.set(
            `Problem contacting the server - Error Code: ${err.status}\nMessage: ${err.message}`
          );
        }

        this.snackBar.open(this.errMsg(), 'OK', { duration: 6000 });

        return of<Todo[]>([]);
      }),

      tap(() => {

      })
    )
  );


  filteredTodos = computed(() => {
    const serverFilteredTodos = this.serverFilteredTodos();

    const sortBy = this.todoSortBy();
    const sortOrder = this.todoSortOrder() ?? 'asc';

    if (!sortBy) {
      return serverFilteredTodos;
    }

    const sortedTodos = [...serverFilteredTodos].sort((a, b) => {
      const aValue = String(a[sortBy]).toLowerCase();
      const bValue = String(b[sortBy]).toLowerCase();

      return aValue.localeCompare(bValue)
    });

    return sortOrder === 'desc' ? sortedTodos.reverse() : sortedTodos;
  });
}
