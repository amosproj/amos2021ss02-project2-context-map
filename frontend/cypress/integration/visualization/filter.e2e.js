import '../../support/index.js';

context('Filter', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000/visualization/graph');
  });

  context('Open/Close View', () => {
    it('opens and closes view correctly', () => {
      cy.get('.Filter').click();
      cy.get('.closeFilter').click();
    });
  });

  context('Number of EntityTypes', () => {
    it('has expected number of nodeTypes', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.FilterButton').should('have.length', 4);
    });
  });

  context('Nodes', () => {
    it('Shows expected property-names', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.FilterButton:first').click();
      cy.get('.FilterDialog');

      // Assert
      cy.contains('born');
      cy.contains('name');
    });

    it('shows expected property-values', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.FilterButton:first').click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect:last').click();

      // Assert
      cy.contains('Keanu Reeves');
      cy.contains('Carrie-Anne Moss');
      cy.contains('Lana Wachowski');
    });

    it('selects no property values', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.FilterButton:first').click();
      cy.get('.FilterDialog');

      cy.get('.ApplyFilter').click();
    });

    it('applies filter', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.FilterButton:first').click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect:last').click();

      cy.contains('Keanu Reeves').click();
      cy.contains('Carrie-Anne Moss').click();
      cy.contains('Lana Wachowski').click();

      cy.get('body').click(0, 0);
      cy.get('.ApplyFilter').click();
    });

    it('adds nodes to view', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.FilterButton:first').click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect:last').click();

      // Assert
      cy.contains('Keanu Reeves').click();
      cy.contains('Carrie-Anne Moss').click();
      cy.contains('Lana Wachowski').click();

      cy.get('body').click(0, 0);
      cy.get('.ApplyFilter').click();
    });

    it('overwrites property state in FilterStateStore', () => {
      cy.get('.Filter').click();
      cy.get('.FilterButton:first').click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect:last').click();

      cy.contains('Keanu Reeves').click();

      cy.get('body').click(0, 0);
      cy.get('.ApplyFilter').click();

      cy.get('.FilterButton:first').click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect:last').click();

      cy.contains('Carrie-Anne Moss').click();

      cy.get('body').click(0, 0);
      cy.get('.ApplyFilter').click();
    });

    it('should add and remove Node Types', () => {
      let nthQuery = 0;
      cy.get('.Filter').click();

      const interceptor = cy.spy((req) => {
        expect(req.body).to.have.property('limits');
        if (nthQuery === 1) {
          expect(req.body.filters.nodes.filters).to.have.length(1);
          expect(req.body.filters.nodes.filters[0]).to.deep.equal({
            rule: 'of-type',
            type: 'Person',
          });
        } else {
          expect(req.body.filters.nodes.filters).to.have.length(0);
        }
        req.continue();
      });

      cy.intercept('*query*', interceptor).as('query');

      cy.contains('Person')
        .then(() => {
          nthQuery += 1;
        })
        .click();

      cy.wait('@query');

      cy.contains('Person')
        .then(() => {
          nthQuery += 1;
        })
        .click();

      cy.wait('@query').then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(interceptor).to.be.calledTwice;
      });
    });
  });

  context('Edges', () => {
    it('shows expected property-names', () => {
      // Act
      cy.get('.Filter').click();
      cy.contains('Edge Types').click();
      cy.get('.FilterButton').eq(2).click();
      cy.get('.FilterDialog');

      // Assert
      cy.contains('roles');
    });

    it('Shows expected property-values', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.EdgeTypes').click();
      cy.get('.FilterButton').eq(2).click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect').first().click();

      // Assert
      cy.contains('[Trinity]').click();
    });

    it('applies filter', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.EdgeTypes').click();
      cy.get('.FilterButton').eq(2).click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect').first().click();

      // Assert
      cy.contains('[Trinity]').click();

      cy.get('body').click(0, 0);
      cy.get('.ApplyFilter').click();
    });

    it('adds edges to view', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.EdgeTypes').click();
      cy.get('.FilterButton').eq(2).click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect').first().click();

      // Assert
      cy.contains('[Trinity]').click();

      cy.get('body').click(0, 0);
      cy.get('.ApplyFilter').click();
    });
  });
});
