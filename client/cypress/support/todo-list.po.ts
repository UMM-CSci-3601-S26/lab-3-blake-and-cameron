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
  private readonly statusSelectSelector = '[data-test=todoStatusSelect]';
  private readonly bodyInputSelector = '[data-test=todoBodyInput]';
  private readonly categorySelectSelector = '[data-test=todoCategorySelect]';
  private readonly sortBySelectSelector = '[data-test=todoSortBySelect]';
  private readonly sortOrderSelectSelector = '[data-test=todoSortOrderSelect]';
  private readonly dropdownOptionSelector = 'mat-option';

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

  typeBody(value: string) {
    return cy.get(this.bodyInputSelector).clear().type(value);
  }

  selectStatus(value: boolean | undefined) {
    cy.get(this.statusSelectSelector).click();
    if (value === undefined) {
      return cy.get(this.dropdownOptionSelector).contains('--').click();
    }
    const label = value ? 'Complete' : 'Incomplete';
    return cy.get('mat-option').contains(label).click();
  }

  selectCategory(value: string | undefined) {
    cy.get(this.categorySelectSelector).click();
    if (value === undefined) {
      return cy.get(this.dropdownOptionSelector).contains('--').click();
    }
    return cy.get(`${this.dropdownOptionSelector}[value="${value}"]`).click();
  }

  selectSortBy(value: 'owner' | 'status' | 'body' | 'category') {
    cy.get(this.sortBySelectSelector).click();
    return cy.get('mat-option').contains(value).click();
  }

  selectSortOrder(value: 'asc' | 'desc') {
    cy.get(this.sortOrderSelectSelector).click();
    return cy.get('mat-option').contains(value).click();
  }
  clickViewTodo(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find(this.viewTodoButtonSelector).click();
  }

  addTodoButton() {
    return cy.get(this.addTodoButtonSelector);
  }
}
