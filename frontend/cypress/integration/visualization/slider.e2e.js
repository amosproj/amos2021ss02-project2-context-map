context('Entity Slider', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/visualization/graph');
    cy.get('.Filter').click();
  });

  it('should change node limits', () => {
    cy.contains(/node types/i).click();

    cy.get('.nodes-slider')
      .should('be.visible')
      .find('.MuiSlider-thumb')
      .should('have.attr', 'aria-valuenow', 4)
      .click()
      .type('{leftarrow}')
      .should('have.attr', 'aria-valuenow', 3);
  });

  it('should change edge limits', () => {
    cy.contains(/edge types/i).click();

    cy.get('.edges-slider')
      .should('be.visible')
      .find('.MuiSlider-thumb')
      .should('have.attr', 'aria-valuenow', 3)
      .click()
      .type('{leftarrow}')
      .should('have.attr', 'aria-valuenow', 2);
  });
});
