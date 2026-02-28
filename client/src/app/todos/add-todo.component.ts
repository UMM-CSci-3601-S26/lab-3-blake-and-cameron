import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo, todoCategory } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
})
export class AddTodoComponent {

  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private todoService = inject(TodoService);

  addTodoForm = new FormGroup({
    owner: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])),

    status: new FormControl<boolean | null>(null, Validators.required),

    category: new FormControl<todoCategory | null>(null, Validators.required),

    body: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(500),
    ])),
  });

  readonly addTodoValidationMessages = {
    owner: [
      { type: 'required', message: 'Owner is required' },
      { type: 'minlength', message: 'Owner must be at least 2 characters long' },
      { type: 'maxlength', message: 'Owner cannot be more than 50 characters long' },
    ],
    status: [
      { type: 'required', message: 'Status is required' },
    ],
    category: [
      { type: 'required', message: 'Category is required' },
    ],
    body: [
      { type: 'required', message: 'Body is required' },
      { type: 'minlength', message: 'Body must be at least 2 characters long' },
      { type: 'maxlength', message: 'Body cannot be more than 500 characters long' },
    ],
  } as const;

  formControlHasError(controlName: string): boolean {
    const control = this.addTodoForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(name: keyof typeof this.addTodoValidationMessages): string {
    for (const { type, message } of this.addTodoValidationMessages[name]) {
      if (this.addTodoForm.get(name)?.hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm(): void {
    if (!this.addTodoForm.valid) {
      this.snackBar.open('Fix the form errors before submitting', 'OK', {
        duration: 4000,
      });
      return;
    }

    const newTodo: Partial<Todo> = this.addTodoForm.value;

    this.todoService.addTodo(newTodo).subscribe({
      next: (newId) => {
        this.snackBar.open(`Added todo for ${newTodo.owner}`, null, {
          duration: 2000,
        });
        this.router.navigate(['/todos', newId]);
      },
      error: (err) => {
        this.snackBar.open(
          `Failed to add todo - Error Code: ${err?.status ?? '??'}\nMessage: ${err?.message ?? err}`,
          'OK',
          { duration: 6000 }
        );
      },
    });
  }
}
