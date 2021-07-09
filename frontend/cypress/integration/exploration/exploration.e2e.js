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

    it('reorders recommendations', () => {
      // Assert that the first recommendation is not 'Structural Layout'
      cy.get('.Previews')
        .find('li')
        .first()
        .contains('Structural Layout')
        .should('not.exist');

      // Select something
      cy.contains('Does one of these use cases match your question?').click();
      cy.contains(
        'I want to analyse multivariate data from surveys and test panels'
      ).click();

      // Assert that the first recommendation is 'Structural Layout'
      cy.get('.Previews').find('li').first().contains('Structural Layout');
    });

    it('questions can be unselected', () => {
      // Open question
      cy.contains('Does one of these use cases match your question?').click();

      // Select answer
      cy.contains(
        'I want to analyse multivariate data from surveys and test panels'
      ).click();
      // Assert that answer is selected
      cy.contains(
        'I want to analyse multivariate data from surveys and test panels'
      ).find('.Mui-checked');

      // Deselect answer
      cy.contains(
        'I want to analyse multivariate data from surveys and test panels'
      ).click();
      // Assert that answer is not selected
      cy.contains(
        'I want to analyse multivariate data from surveys and test panels'
      )
        .find('.Mui-checked')
        .should('not.exist');
    });
  });
});
