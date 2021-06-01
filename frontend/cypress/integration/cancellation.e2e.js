import { apiBaseUrl } from '../support/constants';

context('Filter', () => {
  context('testing-dump', () => {
    it('can be cancelled', () => {
      const loadingIconFound = Cypress.Promise.defer();

      cy.intercept(`${apiBaseUrl}/**`, (req) =>
        loadingIconFound.promise.then(() => req.continue())
      );

      cy.visit('http://localhost:3000/visualization/graph');

      // eslint-disable-next-line cypress/no-force
      cy.contains('Cancel')
        .click({ force: true })
        .then(() => {
          loadingIconFound.resolve();
        });

      cy.contains('Cancellation Error');
    });
  });
});
