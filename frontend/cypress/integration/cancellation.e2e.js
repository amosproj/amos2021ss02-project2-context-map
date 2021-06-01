import { apiBaseUrl } from '../support/constants';

context('Filter', () => {
  context('testing-dump', () => {
    it('can be cancelled', () => {
      const loadingIconFound = Cypress.Promise.defer();

      cy.intercept(`${apiBaseUrl}/**`, (req) =>
        loadingIconFound.promise.then(() => req.continue())
      );

      cy.visit('http://localhost:3000/visualization/graph');

      // wait until loading is done
      cy.get('.MuiBackdrop-root').should('be.visible');

      // eslint-disable-next-line cypress/no-force
      cy.contains('Cancel')
        .click({ force: true })
        .then(() => {
          loadingIconFound.resolve();
        });

      // get visible canvas
      cy.get('.vis-network canvas')
        .should('be.visible')
        .then((jQueryCanvas) => {
          // make sure the "canvas" really is a canvas
          const canvas = jQueryCanvas.get()[0];
          // The following line fails consistently on chromium based browsers:
          // > expect(canvas).to.be.instanceof(HTMLCanvasElement);
          // Thus, the following replacement was created:
          expect(canvas.constructor.name, 'Canvas really is canvas').to.equal(
            'HTMLCanvasElement'
          );

          // Get image data
          const imageData = canvas
            .getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height);
          // check if all pixels are white (color === 0)
          expect(imageData.data.filter((color) => color !== 0)).length(0);
        });
    });
  });
});
