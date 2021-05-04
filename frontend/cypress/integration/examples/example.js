context('App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Shows Hello World', () => {
    cy.contains('Hello World');
  });

  it('Shows a number between 2 and 3 with two decimals', () => {
    cy.contains(/[23]\.\d\d$/);
  });
});
