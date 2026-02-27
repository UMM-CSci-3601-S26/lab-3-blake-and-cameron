import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have a title', () => {
    page.getTodoTitle().should('exist');
  });

  it('Should switch between card and list view', () => {
    page.changeView('card');
    page.getTodoCards().should('exist');

    page.changeView('list');
    page.getTodoListItems().should('exist');
  });

  it('Should filter by owner (client-side)', () => {
    page.changeView('card');
    page.typeOwner('Blanche');

    page.getTodoCards().each(card => {
      cy.wrap(card).find('.todo-card-owner').should('contain.text', 'Blanche');
    });
  });

  it('Should limit the number of todos returned (server-side)', () => {
    page.changeView('card');
    page.typeLimit(3);

    page.getTodoCards().should('have.length.at.most', 3);
  });

  it('Should click "View Todo" and go to a todo profile URL', () => {
    page.changeView('card');

    page.getTodoCards().first().then((card) => {
      const firstOwner = card.find('.todo-card-owner').text();

      page.clickViewTodo(page.getTodoCards().first());

      cy.url().should('match', /\/todos\/[0-9a-fA-F]{24}$/);

      cy.get('.todo-card-owner').first().should('contain.text', firstOwner);
    });
  });

  it('should apply combination of server side filters', () => {
    page.changeView('card');
    page.selectStatus(false);
    page.typeLimit(5);
    page.getTodoCards().should('have.length.at.most', 5);
    page.getTodoCards().first().then(() => {
      page.clickViewTodo(page.getTodoCards().first());
      cy.get('.todo-card-status').should('contain.text', 'Incomplete');
    });

    it('Should sort todos by owner ascending', () => {
      page.changeView('card');
      page.selectSortBy('owner');
      page.selectSortOrder('asc');

      cy.get('.todo-card-owner').then(($els) => {
        const owners = [...$els].map(e => e.textContent?.trim().toLowerCase());
        const sorted = [...owners].sort();
        expect(owners).to.deep.equal(sorted);
      });
    });
  });
});
