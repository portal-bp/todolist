import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('TodoListItem e2e test', () => {
  const todoListItemPageUrl = '/todo-list-item';
  const todoListItemPageUrlPattern = new RegExp('/todo-list-item(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const todoListItemSample = { description: 'Officer Soft encompassing' };

  let todoListItem: any;
  //let todoList: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/todo-lists',
      body: {"title":"communities invoice withdrawal"},
    }).then(({ body }) => {
      todoList = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/todo-list-items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/todo-list-items').as('postEntityRequest');
    cy.intercept('DELETE', '/api/todo-list-items/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/todo-lists', {
      statusCode: 200,
      body: [todoList],
    });

  });
   */

  afterEach(() => {
    if (todoListItem) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/todo-list-items/${todoListItem.id}`,
      }).then(() => {
        todoListItem = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (todoList) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/todo-lists/${todoList.id}`,
      }).then(() => {
        todoList = undefined;
      });
    }
  });
   */

  it('TodoListItems menu should load TodoListItems page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('todo-list-item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TodoListItem').should('exist');
    cy.url().should('match', todoListItemPageUrlPattern);
  });

  describe('TodoListItem page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(todoListItemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TodoListItem page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/todo-list-item/new$'));
        cy.getEntityCreateUpdateHeading('TodoListItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListItemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/todo-list-items',
          body: {
            ...todoListItemSample,
            todoList: todoList,
          },
        }).then(({ body }) => {
          todoListItem = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/todo-list-items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/todo-list-items?page=0&size=20>; rel="last",<http://localhost/api/todo-list-items?page=0&size=20>; rel="first"',
              },
              body: [todoListItem],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(todoListItemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(todoListItemPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response!.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details TodoListItem page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('todoListItem');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListItemPageUrlPattern);
      });

      it('edit button click should load edit TodoListItem page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TodoListItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListItemPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of TodoListItem', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('todoListItem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListItemPageUrlPattern);

        todoListItem = undefined;
      });
    });
  });

  describe('new TodoListItem page', () => {
    beforeEach(() => {
      cy.visit(`${todoListItemPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TodoListItem');
    });

    it.skip('should create an instance of TodoListItem', () => {
      cy.get(`[data-cy="description"]`).type('SMTP Berkshire silver').should('have.value', 'SMTP Berkshire silver');

      cy.get(`[data-cy="done"]`).should('not.be.checked');
      cy.get(`[data-cy="done"]`).click().should('be.checked');

      cy.get(`[data-cy="todoList"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        todoListItem = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', todoListItemPageUrlPattern);
    });
  });
});
