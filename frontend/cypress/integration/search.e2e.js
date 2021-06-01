import { customSearch, emptySearch } from '../fixtures/search/search';

// TODO: Remove interception when real e2e tests are done
context('Searchbar', () => {
  // Global setup
  const apiBaseUrl = 'http://localhost:8080/api';
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Shows results', () => {
    // Act
    cy.get('.SearchBar').type('keanu');
    // Assert
    cy.contains('Nodes');
    cy.contains('Keanu Reeves');
  });

  it('Does not search on every keydown', () => {
    // Arrange
    /* eslint-disable no-unused-expressions -- expect(..).to.Be.Called return can be ignored */
    const spySearch = cy.spy((req) => req.continue());

    cy.intercept(`${apiBaseUrl}/search/all*`, spySearch).as('searchQuery');

    // Act 1
    cy.get('.SearchBar').type('keanu');

    // Assert 1
    cy.wait(['@searchQuery']).then(() => {
      expect(spySearch).to.be.calledOnce;
    });

    // Act 2
    cy.get('.SearchBar').type(' reeves');
    // Assert 2
    cy.wait(['@searchQuery']).then(() => {
      expect(spySearch).to.be.calledTwice;
    });
    /* eslint-enable */
  });

  it('Shows Nodes, NodeTypes, Edges, EdgeTypes', () => {
    // Arrange
    cy.intercept(`${apiBaseUrl}/search/all*`, customSearch.search);

    // Act
    cy.get('.SearchBar').type('Hello');

    // Assert
    cy.contains('Nodes');
    cy.contains('Edges');
    cy.contains('Node Types');
    cy.contains('Edge Types');
  });

  it('Shows and hides Loading Icon', () => {
    // Arrange
    /** Finishes, when the loading icon is found */
    const loadingIconFound = Cypress.Promise.defer();

    cy.intercept(`${apiBaseUrl}/search/all*`, (req) =>
      loadingIconFound.promise.then(() => req.reply(emptySearch.search))
    ).as('searchQuery');

    // Act
    cy.get('.SearchBar').type('keanu');
    // Assert
    cy.get('.LoadingIcon')
      /// Waits on the loading icon
      .should('be.visible')
      /// Then finishes the API call
      .then(() => loadingIconFound.resolve());
    cy.get('.LoadingIcon').should('not.exist');
  });

  it('Cancels queries if next query comes in without error', () => {
    // Arrange
    let numQuery = 0;

    cy.intercept(`${apiBaseUrl}/search/all*`, (req) => {
      if (numQuery === 0) {
        numQuery += 1;
        // Will never return.
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return new Promise(() => {});
      }
      return req.reply(emptySearch.search);
    }).as('searchQuery');

    // Act
    cy.get('.SearchBar').type('keanu');

    // It fires a query after 300ms without typing
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(325);

    cy.get('.SearchBar').type(' reeves');
  });

  it('Can handle error', () => {
    // Arrange
    cy.intercept(`${apiBaseUrl}/**`, (req) => req.destroy());

    // Act
    cy.get('.SearchBar').type('keanu');

    // Assert
    cy.contains('error occurred');
  });
});
