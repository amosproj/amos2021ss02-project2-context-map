import { iif } from 'rxjs';

context('Chord Diagram', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000/visualization/chord');
  });

  it('visualises entities', () => {
    cy.contains('Person');
    cy.contains('Movie');
  });

  it('shows details on chord diagram click', () => {
    cy.contains('Person').click();
    // check if there are 3 connections to Movie's
    cy.get('td') // select table cells
      .contains('Movie') // find cell with text 'Movie'
      .parents('tr') // find table row to cell
      .contains(3); // check if it contains '3'
  });

  it('shows details on entity type search', () => {
    cy.get('.SearchBar').type('Node');

    // click search result
    cy.get('.SubList').contains('Movie').click();

    cy.contains('Details') // find details text
      .parents('.MuiCard-root') // select corresponding card
      .contains('Node Type') // find header "Node Types"
      .next() // next sibling
      .contains('Movie'); // check if it contains 'Movie'
  });

  it('shows details on entity search', () => {
    cy.get('.SearchBar').type('keanu');

    // click search result
    cy.get('.SubList').contains('Person').click();

    cy.contains('Details') // find details text
      .parents('.MuiCard-root') // select corresponding card
      .contains('Node Type') // find header "Node Types"
      .next() // next sibling
      .contains('Person'); // check if it contains 'Movie'
  });

  it('displays an error when trying to highlight an edge', () => {
    cy.get('.SearchBar').type('directed');

    // click search result
    cy.get('.SubList').contains('DIRECTED').click();

    cy.get('#notistack-snackbar').contains(
      'Only nodes and node types can be highlighted.'
    );
  });
});
