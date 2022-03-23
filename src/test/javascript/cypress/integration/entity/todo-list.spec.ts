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

describe('TodoList e2e test', () => {
  const todoListPageUrl = '/todo-list';
  const todoListPageUrlPattern = new RegExp('/todo-list(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const todoListSample = { title: 'Shirt Spain program' };

  let todoList: any;
  //let user: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"input PCI primary","firstName":"Abigayle","lastName":"Hilpert"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/todo-lists+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/todo-lists').as('postEntityRequest');
    cy.intercept('DELETE', '/api/todo-lists/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

  });
   */

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

  /* Disabled due to incompatibility
  afterEach(() => {
    if (user) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${user.id}`,
      }).then(() => {
        user = undefined;
      });
    }
  });
   */

  it('TodoLists menu should load TodoLists page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('todo-list');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TodoList').should('exist');
    cy.url().should('match', todoListPageUrlPattern);
  });

  describe('TodoList page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(todoListPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TodoList page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/todo-list/new$'));
        cy.getEntityCreateUpdateHeading('TodoList');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/todo-lists',
          body: {
            ...todoListSample,
            user: user,
          },
        }).then(({ body }) => {
          todoList = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/todo-lists+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/todo-lists?page=0&size=20>; rel="last",<http://localhost/api/todo-lists?page=0&size=20>; rel="first"',
              },
              body: [todoList],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(todoListPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(todoListPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response!.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details TodoList page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('todoList');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListPageUrlPattern);
      });

      it('edit button click should load edit TodoList page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TodoList');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of TodoList', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('todoList').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListPageUrlPattern);

        todoList = undefined;
      });
    });
  });

  describe('new TodoList page', () => {
    beforeEach(() => {
      cy.visit(`${todoListPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TodoList');
    });

    it.skip('should create an instance of TodoList', () => {
      cy.get(`[data-cy="title"]`).type('Soft EXE').should('have.value', 'Soft EXE');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        todoList = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', todoListPageUrlPattern);
    });
  });
});
