context('App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Shows Hello World', () => {
    cy.contains('WELCOME TO KMAP');
  });
});
