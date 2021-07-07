context('Graph details', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000/visualization/graph');
  });

  it('shows details on node search', () => {
    cy.get('.SearchBar').type('keanu');

    // click search result to open details view
    cy.get('.SubList').contains('Person').click();

    cy.contains('Details') // find details text
      .parents('.MuiCard-root') // select corresponding card
      .contains('Type(s)') // find header "Type(s)"
      .next() // next sibling
      .contains('Person'); // check if it contains 'Movie'
  });

  it('shows details on edge search', () => {
    cy.get('.SearchBar').type('directed');

    // click search result to open details view
    cy.get('.SubList').contains('DIRECTED').click();

    cy.contains('Details') // find details text
      .parents('.MuiCard-root') // select corresponding card
      .contains('Type(s)') // find header "Type(s)"
      .next() // next sibling
      .contains('DIRECTED'); // check if it contains 'DIRECTED'
  });

  it('closes on clicking the close button', () => {
    cy.get('.SearchBar').type('keanu');

    // click search result to open details view
    cy.get('.SubList').contains('Person').click();

    cy.get('.MuiCardHeader-action').click(); // click close button
    cy.get('Details').should('not.exist'); // check if details view closed
  });
});
