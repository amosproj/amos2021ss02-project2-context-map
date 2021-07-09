import { apiBaseUrl } from '../../support/constants';

context('Visualization Tabs', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000/visualization');
  });

  it('has visualization dashboard tab', () => {
    cy.get('.MuiTabs-root').contains('Visualization').click();
    cy.get('main').contains('Visualization Dashboard');
  });

  it('has graph tab', () => {
    cy.intercept(`${apiBaseUrl}/queryAll*`, { nodes: [], edges: [] });
    cy.intercept(`${apiBaseUrl}/schema/edge-types`, []);
    cy.intercept(`${apiBaseUrl}/schema/node-types`, []);

    cy.get('.MuiTabs-root').contains('Graph').click();
    cy.get('main').get('.vis-network');
  });

  it('has hierarchies tab', () => {
    cy.get('.MuiTabs-root').contains('Hierarchies').click();
    cy.get('main').get('.vis-network');
  });

  it('has chord tab', () => {
    cy.get('.MuiTabs-root').contains('Chord Diagram').click();
    cy.get('main').get('.svg-container');
  });

  it('has betweenness tab', () => {
    cy.get('.MuiTabs-root').contains('Betweenness').click();
    cy.get('main').contains('Betweenness');
  });

  it('has radial tab', () => {
    cy.get('.MuiTabs-root').contains('Radial').click();
    cy.get('main').contains('Radial');
  });

  it('has schema tab', () => {
    cy.get('.MuiTabs-root').contains('Schema').click();
    cy.get('main').get('.vis-network');
  });
});
