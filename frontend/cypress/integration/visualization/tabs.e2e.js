context('Visualization Tabs', () => {
  context('testing-dump', () => {
    const apiBaseUrl = 'http://localhost:8080/api';
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

    it('has schema tab', () => {
      cy.get('.MuiTabs-root').contains('Schema').click();
      cy.get('main').contains('Schema');
    });
  });
});
