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
    // TODO: add more tests when combined with questions
  });
});
