import layoutsData from '../../../src/exploration/previews/layoutsData';

context('Exploration', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000/exploration');
  });

  context('Previews', () => {
    it('lists correct number of previews', () => {
      cy.get('.Previews');
      cy.get('.LayoutPreview').should('have.length', 7);
    });

    it('correct initial layouts', () => {
      cy.get('.Previews');

      const layoutsDataValues = Object.values(layoutsData);
      cy.get('.LayoutPreview').each(($el, index) => {
        cy.wrap($el).should('have.text', layoutsDataValues[index].description);
      });
    });

    it('routes to graph page', () => {
      cy.get('.Previews');
      cy.get('.LayoutPreview').eq(0).click();
      cy.url().should('eq', `http://localhost:3000${layoutsData.C.path}`);
    });

    it('routes to hierarchical page', () => {
      cy.get('.Previews');
      cy.get('.LayoutPreview').eq(2).click();
      cy.url().should('eq', `http://localhost:3000${layoutsData.H.path}`);
    });

    // TODO: add more tests when combined with questions
  });
});
