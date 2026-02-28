import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';
import { Todo } from './todo';
import { throwError } from 'rxjs';

describe('TodoListComponent sorting', () => {
  let todoService: jasmine.SpyObj<TodoService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const makeTodos = (): Todo[] => ([
    { _id: '1', owner: 'Barry', status: false, body: 'b', category: 'homework' },
    { _id: '2', owner: 'Alice', status: true, body: 'a', category: 'groceries' },
    { _id: '3', owner: 'Dawn', status: false, body: 'c', category: 'video games' },
  ]);

  beforeEach(async () => {
    todoService = jasmine.createSpyObj<TodoService>('TodoService', ['getTodos', 'filterTodo']);
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    // filterTodo is used by filteredTodos() for the owner filter
    todoService.filterTodo.and.callFake((todos: Todo[], filters: { owner?: string }) => {
      if (!filters.owner) return todos;
      const owner = filters.owner.toLowerCase();
      return todos.filter(t => t.owner.toLowerCase().includes(owner));
    });

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: todoService },
        { provide: MatSnackBar, useValue: snackBar },
        provideRouter([])
      ],
    }).compileComponents();
  });

  it('sorts by owner asc', () => {
    const todos = makeTodos();
    todoService.getTodos.and.returnValue(of(todos));

    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;

    // trigger initial subscriptions (toSignal pipeline runs)
    fixture.detectChanges();

    component.todoOwner.set(undefined);
    component.todoSortBy.set('owner');
    component.todoSortOrder.set('asc');

    const owners = component.filteredTodos().map(t => t.owner);
    expect(owners).toEqual(['Alice', 'Barry', 'Dawn']);
  });

  it('sorts by owner desc', () => {
    const todos = makeTodos();
    todoService.getTodos.and.returnValue(of(todos));

    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.todoOwner.set(undefined);
    component.todoSortBy.set('owner');
    component.todoSortOrder.set('desc');

    const owners = component.filteredTodos().map(t => t.owner);
    expect(owners).toEqual(['Dawn', 'Barry', 'Alice']);
  });

  it('requests server filtering by owner and sorting by category asc', () => {
    const todos: Todo[] = [
      { _id: '1', owner: 'Blanche', status: true, body: 'x', category: 'software design' },
      { _id: '2', owner: 'Barry', status: false, body: 'y', category: 'groceries' },
      { _id: '3', owner: 'Blanche', status: false, body: 'z', category: 'homework' },
    ];

    todoService.getTodos.and.returnValue(of(todos));

    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;

    component.todoOwner.set('blan');
    component.todoSortBy.set('category');
    component.todoSortOrder.set('asc');

    fixture.detectChanges();

    expect(todoService.getTodos).toHaveBeenCalled();

    const lastCallArgs = todoService.getTodos.calls.mostRecent().args[0];

    expect(lastCallArgs.owner).toBe('blan');
    expect(lastCallArgs.sortBy).toBe('category');
    expect(lastCallArgs.sortOrder).toBe('asc');
  });
  it('returns unsorted results when sortBy is undefined', () => {
    todoService.getTodos.and.returnValue(of([
      { _id: '1', owner: 'B', status: false, body: 'b', category: 'homework' },
      { _id: '2', owner: 'A', status: true, body: 'a', category: 'groceries' },
    ]));

    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.todoSortBy.set(undefined);
    const owners = component.filteredTodos().map(t => t.owner);

    expect(owners).toEqual(['B', 'A']);
  });
  it('shows snackbar and returns empty list when server errors', () => {
    todoService.getTodos.and.returnValue(throwError(() => ({ status: 500, message: 'fail', error: {} })));

    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalled();
    expect(component.serverFilteredTodos()).toEqual([]);
  });
  it('defaults sortOrder to asc when undefined', () => {
    todoService.getTodos.and.returnValue(of([
      { _id: '1', owner: 'B', status: false, body: 'b', category: 'homework' },
      { _id: '2', owner: 'A', status: true, body: 'a', category: 'groceries' },
    ]));

    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.todoSortBy.set('owner');
    component.todoSortOrder.set(undefined); // hit the ?? 'asc' branch

    expect(component.filteredTodos().map(t => t.owner)).toEqual(['A', 'B']);
  });
});
