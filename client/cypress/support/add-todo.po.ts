export class AddTodoPage {
  private readonly url = '/todos/new';

  private readonly owner = '[formcontrolname="owner"]';
  private readonly status = '[formcontrolname="status"]';
  private readonly category = '[formcontrolname="category"]';
  private readonly body = '[formcontrolname="body"]';
  private readonly submit = '[data-test="confirmAddTodoButton"]';

  navigateTo() {
    return cy.visit(this.url);
  }

  ownerField() {
    return cy.get(this.owner);
  }

  statusSelect() {
    return cy.get(this.status);
  }

  categorySelect() {
    return cy.get(this.category);
  }

  bodyField() {
    return cy.get(this.body);
  }

  submitButton() {
    return cy.get(this.submit);
  }

  private pickOptionByText(text: string) {
    return cy.get('mat-option').contains(text).click();
  }

  pickStatus(completed: boolean) {
    this.statusSelect().click();
    return this.pickOptionByText(completed ? 'Completed' : 'Incomplete');
  }

  pickCategory(category: string) {
    this.categorySelect().click();
    return this.pickOptionByText(category);
  }
}
