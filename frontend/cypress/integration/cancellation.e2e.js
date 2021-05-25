context('Filter', () => {
  const apiBaseUrl = 'http://localhost:8080/api';

  it('can be cancelled', () => {
    const loadingIconFound = Cypress.Promise.defer();

    cy.intercept(`${apiBaseUrl}/**`, (req) =>
      loadingIconFound.promise.then(() => req.continue())
    );

    cy.visit('http://localhost:3000/visualization/graph');

    cy.contains('Cancel')
      .click({ force: true })
      .then(() => {
        loadingIconFound.resolve();
      });

    cy.contains('The operation was cancelled.');
  });
});
