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
    const spyGetNodesById = cy.spy((req) => req.continue());

    cy.intercept(`${apiBaseUrl}/search/all*`, spySearch).as('searchQuery');
    cy.intercept(`${apiBaseUrl}/getNodesById*`, spyGetNodesById).as(
      'getNodesQuery'
    );

    // Act 1
    cy.get('.SearchBar').type('keanu');

    // Assert 2
    cy.wait(['@searchQuery', '@getNodesQuery']).then(() => {
      expect(spySearch).to.be.calledOnce;
      expect(spyGetNodesById).to.be.calledOnce;
    });

    // Act 2
    cy.get('.SearchBar').type(' reeves');
    // Assert 2
    cy.wait(['@searchQuery', '@getNodesQuery']).then(() => {
      expect(spySearch).to.be.calledTwice;
      expect(spyGetNodesById).to.be.calledTwice;
    });
    /* eslint-enable */
  });

  it('Shows Nodes, NodeTypes, Edges, EdgeTypes', () => {
    // Arrange
    cy.intercept(`${apiBaseUrl}/search/all*`, customSearch.search);
    cy.intercept(`${apiBaseUrl}/getNodesById*`, customSearch.getNodesById);
    cy.intercept(`${apiBaseUrl}/getEdgesById*`, customSearch.getEdgesById);

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
});
