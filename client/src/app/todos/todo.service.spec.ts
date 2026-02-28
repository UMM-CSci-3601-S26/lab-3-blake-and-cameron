import { HttpClient, HttpParams, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  const testTodos: Todo[] = [
    {
      _id: 'todo1',
      owner: 'Blanche',
      status: true,
      body: 'Do software design homework',
      category: 'software design',
    },
    {
      _id: 'todo2',
      owner: 'Barry',
      status: false,
      body: 'Buy groceries',
      category: 'groceries',
    },
    {
      _id: 'todo3',
      owner: 'Blanche',
      status: false,
      body: 'More homework tasks',
      category: 'homework',
    },
  ];

  let todoService: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    todoService = TestBed.inject(TodoService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('When getTodos() is called with no parameters', () => {
    it('calls `api/todos` with empty params', waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

      todoService.getTodos().subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint with empty params')
          .toHaveBeenCalledWith(todoService.todoUrl, { params: new HttpParams() });
      });
    }));
  });

  describe('When getTodos() is called with server-side filter params', () => {
    it('adds the `limit` query param', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

      todoService.getTodos({ limit: 2 }).subscribe(() => {
        const [url, options] = mockedMethod.calls.argsFor(0);
        const calledParams = options.params as HttpParams;

        expect(url).toEqual(todoService.todoUrl);
        expect(calledParams.get('limit')).toEqual('2');
      });
    });

    it('adds the `status` query param', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

      todoService.getTodos({ status: true }).subscribe(() => {
        const [, options] = mockedMethod.calls.argsFor(0);
        const calledParams = options.params as HttpParams;

        expect(calledParams.get('status')).toEqual('complete');
      });
    });

    it('correctly forms a request with multiple filter params (combo filters)', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

      todoService
        .getTodos({
          owner: 'Blanche',
          category: 'software design',
          body: 'homework',
          status: true,
          limit: 5,
        })
        .subscribe(() => {
          const [url, options] = mockedMethod.calls.argsFor(0);
          const calledParams = options.params as HttpParams;

          expect(url).toEqual(todoService.todoUrl);

          expect(calledParams.keys().length).toEqual(5);

          expect(calledParams.get('owner')).toEqual('Blanche');
          expect(calledParams.get('category')).toEqual('software design');
          expect(calledParams.get('body')).toEqual('homework');
          expect(calledParams.get('status')).toEqual('complete');
          expect(calledParams.get('limit')).toEqual('5');
        });
    });
  });

  describe('Client-side filtering using filterTodo()', () => {
    it('filters by owner (partial, case-insensitive)', () => {
      const filtered = todoService.filterTodo(testTodos, { owner: 'blan' });
      expect(filtered.length).toBe(2);
      filtered.forEach(t => expect(t.owner.toLowerCase()).toContain('blan'));
    });

    it('filters by category (partial, case-insensitive)', () => {
      const filtered = todoService.filterTodo(testTodos, { category: 'work' });
      expect(filtered.length).toBe(1);
      filtered.forEach(t => expect(t.category.toLowerCase()).toContain('work'));
    });

    it('filters by owner AND category together', () => {
      const filtered = todoService.filterTodo(testTodos, { owner: 'blanche', category: 'software' });
      expect(filtered.length).toBe(1);
      filtered.forEach(t => {
        expect(t.owner.toLowerCase()).toContain('blanche');
        expect(t.category.toLowerCase()).toContain('software');
      });
    });
  });

  describe('Adding a todo using addTodo()', () => {
    it('talks to the right endpoint and returns the new id', waitForAsync(() => {
      const todo_id = 'newTodoId';
      const expected_http_response = { id: todo_id };

      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(expected_http_response));

      todoService.addTodo(testTodos[0]).subscribe((new_id) => {
        expect(new_id).toBe(todo_id);
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext('correct endpoint').toHaveBeenCalledWith(todoService.todoUrl, testTodos[0]);
      });
    }));
  });
  it('adds sortBy and sortOrder params', () => {
    const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

    todoService.getTodos({ sortBy: 'owner', sortOrder: 'desc' }).subscribe(() => {
      const [, options] = mockedMethod.calls.argsFor(0);
      const calledParams = options.params as HttpParams;

      expect(calledParams.get('sortBy')).toEqual('owner');
      expect(calledParams.get('sortOrder')).toEqual('desc');
    });
  });
});
