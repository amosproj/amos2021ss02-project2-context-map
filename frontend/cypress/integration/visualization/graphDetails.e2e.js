context('Graph details', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000/visualization/graph');
  });

  it('shows details on entity search', () => {
    cy.get('.SearchBar').type('keanu');

    // click search result
    cy.get('.SubList').contains('Person').click();

    cy.contains('Details') // find details text
      .parents('.MuiCard-root') // select corresponding card
      .contains('Type(s)') // find header "Type(s)"
      .next() // next sibling
      .contains('Person'); // check if it contains 'Movie'
  });

  it('closes on clicking the close button', () => {
    cy.get('.SearchBar').type('keanu');

    // click search result
    cy.get('.SubList').contains('Person').click();

    cy.get('.MuiCardHeader-action').click();
    cy.get('Details').should('not.exist');
  });
});
