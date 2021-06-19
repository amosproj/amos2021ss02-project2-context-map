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
      for (const layoutsDataValue of layoutsDataValues) {
        cy.get('.LayoutPreview').contains(layoutsDataValue.description);
      }
    });

    it('routes to graph page', () => {
      cy.get('.Previews');
      cy.get('.LayoutPreview').contains('Structural Layout').click();
      cy.url().should('eq', `http://localhost:3000${layoutsData.C.path}`);
    });

    it('routes to hierarchical page', () => {
      cy.get('.Previews');
      cy.get('.LayoutPreview').contains('Hierarchical Layout').click();
      cy.url().should('eq', `http://localhost:3000${layoutsData.H.path}`);
    });

    it('routes to chord page', () => {
      cy.get('.Previews');
      cy.get('.LayoutPreview').contains('Chord Diagram').click();
      cy.url().should('eq', `http://localhost:3000${layoutsData.P.path}`);
    });

    // TODO: add more tests when combined with questions
  });
});
