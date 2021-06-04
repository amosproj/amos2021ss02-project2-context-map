import React from 'react';

import { mount } from '@cypress/react';
import { CyHttpMessages } from 'cypress/types/net-stubbing';
import {
  customSearch,
  emptySearch,
  keanuSearch,
} from '../fixtures/search/search';
import Searchbar from '../../src/search/Searchbar';

context('Searchbar', () => {
  // Global setup
  const apiBaseUrl = 'http://localhost:8080/api';
  beforeEach(() => {
    mount(<Searchbar />);
  });

  it('Shows results', () => {
    // Arrange
    cy.intercept(`${apiBaseUrl}/search/all*`, keanuSearch.search);
    // Act
    cy.get('.SearchBar').type('keanu');
    // Assert
    cy.contains('Nodes');
    cy.contains('Keanu Reeves');
  });

  it('Does not search on every keydown', () => {
    // Arrange
    /* eslint-disable @typescript-eslint/ban-ts-comment, no-unused-expressions -- expect(..).to.Be.Called is right as it is */
    const spySearch = cy.spy((req: CyHttpMessages.IncomingHttpRequest) => {
      req.reply(keanuSearch.search);
    });
    cy.intercept(`${apiBaseUrl}/search/all*`, spySearch).as('searchQuery');

    // Act 1
    cy.get('.SearchBar').type('keanu');
    // Assert 1
    cy.wait(['@searchQuery']).then(() => {
      // @ts-ignore -- type is Chai.AssertionStatic
      expect(spySearch).to.be.calledOnce;
    });

    // Act 2
    cy.get('.SearchBar').type(' reeves');
    // Assert 2
    cy.wait(['@searchQuery']).then(() => {
      // @ts-ignore -- type is Chai.AssertionStatic
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
    const loadingIconFound = Cypress.Promise.defer<void>();

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
