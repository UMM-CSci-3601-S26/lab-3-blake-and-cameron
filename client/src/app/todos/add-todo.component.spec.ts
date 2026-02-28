import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { throwError } from 'rxjs';

import { AddTodoComponent } from './add-todo.component';
import { TodoService } from './todo.service';

describe('AddTodoComponent', () => {
  let todoService: jasmine.SpyObj<TodoService>;
  let router: Router;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    todoService = jasmine.createSpyObj<TodoService>('TodoService', ['addTodo']);
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [AddTodoComponent],
      providers: [
        { provide: TodoService, useValue: todoService },
        { provide: MatSnackBar, useValue: snackBar },
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  it('submits a valid form, calls addTodo, and navigates to the new todo profile', () => {
    todoService.addTodo.and.returnValue(of('507f1f77bcf86cd799439011'));

    const fixture = TestBed.createComponent(AddTodoComponent);
    const component = fixture.componentInstance;

    component.addTodoForm.setValue({
      owner: 'Test Owner',
      status: false,
      category: 'homework',
      body: 'Test body',
    });

    component.submitForm();

    expect(todoService.addTodo).toHaveBeenCalledTimes(1);
    expect(todoService.addTodo).toHaveBeenCalledWith(jasmine.objectContaining({
      owner: 'Test Owner',
      status: false,
      category: 'homework',
      body: 'Test body',
    }));

    expect(snackBar.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/todos', '507f1f77bcf86cd799439011']);
  });
  it('does not submit when form is invalid and shows snackbar', () => {
    todoService.addTodo.and.returnValue(of('507f1f77bcf86cd799439011'));

    const fixture = TestBed.createComponent(AddTodoComponent);
    const component = fixture.componentInstance;

    component.addTodoForm.setValue({
      owner: '',
      status: null,
      category: null,
      body: '',
    });

    component.submitForm();

    expect(todoService.addTodo).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('shows an error snackbar when addTodo fails', () => {
    todoService.addTodo.and.returnValue(throwError(() => ({ status: 500, message: 'boom' })));

    const fixture = TestBed.createComponent(AddTodoComponent);
    const component = fixture.componentInstance;

    component.addTodoForm.setValue({
      owner: 'Owner',
      status: false,
      category: 'homework',
      body: 'Body',
    });

    component.submitForm();

    expect(todoService.addTodo).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
