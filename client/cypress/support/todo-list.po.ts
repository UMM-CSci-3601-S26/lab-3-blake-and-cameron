export class TodoListPage {
  private readonly baseUrl = '/todos';

  private readonly pageTitle = '.todo-list-title';
  private readonly todoCardSelector = '.todo-cards-container app-todo-card';
  private readonly todoListItemsSelector = '[data-test=todoListItem]';
  private readonly radioButtonSelector = '[data-test=viewTypeRadio] mat-radio-button';
  private readonly ownerInputSelector = '[data-test=todoOwnerInput]';
  private readonly limitInputSelector = '[data-test=todoLimitInput]';
  private readonly viewTodoButtonSelector = '[data-test=viewProfileButton]';
  private readonly addTodoButtonSelector = '[data-test=addTodoButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getTodoTitle() {
    return cy.get(this.pageTitle);
  }

  getTodoCards() {
    return cy.get(this.todoCardSelector);
  }

  getTodoListItems() {
    return cy.get(this.todoListItemsSelector);
  }

  changeView(viewType: 'card' | 'list') {
    return cy.get(`${this.radioButtonSelector}[value="${viewType}"]`).click();
  }

  typeOwner(value: string) {
    return cy.get(this.ownerInputSelector).clear().type(value);
  }

  typeLimit(value: number) {
    return cy.get(this.limitInputSelector).clear().type(String(value));
  }

  clickViewTodo(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find(this.viewTodoButtonSelector).click();
  }

  addTodoButton() {
    return cy.get(this.addTodoButtonSelector);
  }
}
