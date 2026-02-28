import { Component, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { TodoCardComponent } from './todo-card.component';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-profile',
  templateUrl: './todo-profile.component.html',
  styleUrls: ['./todo-profile.component.scss'],
  standalone: true,
  imports: [TodoCardComponent, MatCardModule],
})
export class TodoProfileComponent {
  private route = inject(ActivatedRoute);
  private todoService = inject(TodoService);

  todo = toSignal(
    this.route.paramMap.pipe(
      // Map the paramMap into the id
      map((paramMap: ParamMap) => paramMap.get('id')),
      // Map the `id` into the Observable<Todo>
      switchMap((id: string | null) => {
        if (!id) {
          this.error.set({
            help: 'Missing todo id in the URL.',
            httpResponse: '',
            message: 'No id route parameter found.',
          });
          return of(undefined);
        }
        return this.todoService.getTodoById(id);
      }),
      catchError((_err) => {
        this.error.set({
          help: 'There was a problem loading the todo – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        });
        return of(undefined);
      })
    )
  );

  // The `error` will initially have empty strings for all its components.
  error = signal({ help: '', httpResponse: '', message: '' });
}
