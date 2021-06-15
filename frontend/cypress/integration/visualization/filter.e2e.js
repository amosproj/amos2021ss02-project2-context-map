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

      cy.get('.AddButton:first').click();
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

      cy.get('.AddButton:first').click();
      cy.get('.AddButton:first').click();
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
      cy.contains('Error: No string').click();
    });

    it('applies filter', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.EdgeTypes').click();
      cy.get('.FilterButton').eq(2).click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect').first().click();

      // Assert
      cy.contains('Error: No string').click();

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
      cy.contains('Error: No string').click();

      cy.get('body').click(0, 0);
      cy.get('.ApplyFilter').click();

      cy.get('.AddButton').eq(2).click();
      cy.get('.AddButton').eq(2).click();
    });
  });
});
