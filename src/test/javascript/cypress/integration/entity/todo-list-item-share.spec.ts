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

describe('TodoListItemShare e2e test', () => {
  const todoListItemSharePageUrl = '/todo-list-item-share';
  const todoListItemSharePageUrlPattern = new RegExp('/todo-list-item-share(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const todoListItemShareSample = {};

  let todoListItemShare: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/todo-list-item-shares+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/todo-list-item-shares').as('postEntityRequest');
    cy.intercept('DELETE', '/api/todo-list-item-shares/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (todoListItemShare) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/todo-list-item-shares/${todoListItemShare.id}`,
      }).then(() => {
        todoListItemShare = undefined;
      });
    }
  });

  it('TodoListItemShares menu should load TodoListItemShares page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('todo-list-item-share');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TodoListItemShare').should('exist');
    cy.url().should('match', todoListItemSharePageUrlPattern);
  });

  describe('TodoListItemShare page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(todoListItemSharePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TodoListItemShare page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/todo-list-item-share/new$'));
        cy.getEntityCreateUpdateHeading('TodoListItemShare');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListItemSharePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/todo-list-item-shares',
          body: todoListItemShareSample,
        }).then(({ body }) => {
          todoListItemShare = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/todo-list-item-shares+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [todoListItemShare],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(todoListItemSharePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TodoListItemShare page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('todoListItemShare');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListItemSharePageUrlPattern);
      });

      it('edit button click should load edit TodoListItemShare page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TodoListItemShare');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListItemSharePageUrlPattern);
      });

      it('last delete button click should delete instance of TodoListItemShare', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('todoListItemShare').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', todoListItemSharePageUrlPattern);

        todoListItemShare = undefined;
      });
    });
  });

  describe('new TodoListItemShare page', () => {
    beforeEach(() => {
      cy.visit(`${todoListItemSharePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TodoListItemShare');
    });

    it('should create an instance of TodoListItemShare', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        todoListItemShare = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', todoListItemSharePageUrlPattern);
    });
  });
});
