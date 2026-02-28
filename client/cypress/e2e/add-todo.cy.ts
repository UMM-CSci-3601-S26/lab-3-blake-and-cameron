import { AddTodoPage } from '../support/add-todo.po';

describe('Add Todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    cy.task('seed:database');
    cy.visit('/todos');
  });

  it('navigates to the add todo page', () => {
    cy.get('[data-test=addTodoButton]').click();
    cy.location('pathname').should('eq', '/todos/new');
  });

  it('keeps the submit button disabled until the form is valid', () => {
    cy.get('[data-test=addTodoButton]').click();
    page.submitButton().should('be.disabled');

    page.ownerField().type('Cypress Owner');
    page.submitButton().should('be.disabled');

    page.pickStatus(false);
    page.submitButton().should('be.disabled');

    page.pickCategory('homework');
    page.submitButton().should('be.disabled');

    page.bodyField().type('Created by Cypress');
    page.submitButton().should('be.enabled');
  });

  it('adds a todo and shows it on the profile page', () => {
    const owner = 'Cypress Owner';
    const body = 'This todo was created by Cypress';
    const category = 'homework';
    const completed = true;

    cy.get('[data-test=addTodoButton]').click();

    cy.intercept('POST', '/api/todos').as('addTodo');

    page.ownerField().type(owner);
    page.pickStatus(completed);
    page.pickCategory(category);
    page.bodyField().type(body);

    page.submitButton().click();

    cy.wait('@addTodo');

    cy.location('pathname').should('match', /^\/todos\/[0-9a-fA-F]{24}$/);

    cy.get('.todo-card-owner').should('contain.text', owner);
    cy.get('.todo-card-body').should('contain.text', body);
    cy.get('.todo-card-status').should('contain.text', completed ? 'Complete' : 'Incomplete');
    cy.contains(category).should('exist');
  });
});
