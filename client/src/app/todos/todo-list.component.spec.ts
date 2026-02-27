import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';
import { Todo } from './todo';

describe('TodoListComponent sorting', () => {
  let todoService: jasmine.SpyObj<TodoService>;

  const makeTodos = (): Todo[] => ([
    { _id: '1', owner: 'Barry', status: false, body: 'b', category: 'homework' },
    { _id: '2', owner: 'Alice', status: true, body: 'a', category: 'groceries' },
    { _id: '3', owner: 'Dawn', status: false, body: 'c', category: 'video games' },
  ]);

  beforeEach(async () => {
    todoService = jasmine.createSpyObj<TodoService>('TodoService', ['getTodos', 'filterTodo']);

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
        { provide: MatSnackBar, useValue: { open: () => {} } },
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

  it('applies owner filter before sorting', () => {
    const todos: Todo[] = [
      { _id: '1', owner: 'Blanche', status: true, body: 'x', category: 'software design' },
      { _id: '2', owner: 'Barry', status: false, body: 'y', category: 'groceries' },
      { _id: '3', owner: 'Blanche', status: false, body: 'z', category: 'homework' },
    ];
    todoService.getTodos.and.returnValue(of(todos));

    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.todoOwner.set('blan');
    component.todoSortBy.set('category');
    component.todoSortOrder.set('asc');

    const result = component.filteredTodos();
    expect(result.length).toBe(2);
    expect(result.map(t => t.category)).toEqual(['homework', 'software design']);
  });
});
