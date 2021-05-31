context('Filter', () => {
  const apiBaseUrl = 'http://localhost:8080/api';

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

    // wait until loading is done
    cy.get('.MuiBackdrop-root').should('be.visible');

    // get visible canvas
    cy.get('.vis-network canvas')
      .should('be.visible')
      .then((jQueryCanvas) => {
        // make sure the "canvas" really is a canvas
        const canvas = jQueryCanvas.get()[0];
        expect(canvas).to.be.instanceof(HTMLCanvasElement);
        if (canvas instanceof HTMLCanvasElement) {
          /// if (...) to enable intellisense
          const imageData = canvas
            .getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height);
          // check if all pixels are white (color === 0)
          expect(imageData.data.filter((color) => color !== 0)).length(0);
        } else {
          /// will be caught by instanceof check, but just to be sure
          expect(1).to.eq(0);
        }
      });
  });
});
