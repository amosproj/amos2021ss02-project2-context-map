context('Routes', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // Open Drawer
    cy.get('button[aria-label="open drawer"]').click();
  });

  it('has an accessible home route', () => {
    cy.contains('Home').click();
    cy.get('header').contains('Home');
  });
  it('has an accessible visualization route', () => {
    cy.contains('Visualization').click();
    cy.get('header').contains('Visualization');
  });
  it('has an accessible exploration route', () => {
    cy.contains('Exploration').click();
    cy.get('header').contains('Exploration');
  });
  it('has an accessible data route', () => {
    cy.contains('Data').click();
    cy.get('header').contains('Data');
  });
  it('has an accessible archetypes route', () => {
    cy.contains('Archetypes').click();
    cy.get('header').contains('Archetypes');
  });
});
