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

    it('Shows expected property-values', () => {
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

    it('constructs correct filterQuery', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.FilterButton:first').click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect:last').click();

      // Assert
      cy.contains('Keanu Reeves').click();
      cy.contains('Carrie-Anne Moss').click();
      cy.contains('Lana Wachowski').click();
      // eslint-disable-next-line
      cy.get('.ApplyFilter').focus().click({ force: true });
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
      // eslint-disable-next-line
      cy.get('.ApplyFilter').focus().click({ force: true });

      cy.get('.AddButton:first').click();
      cy.get('.AddButton:first').click();
    });
  });

  context('Edges', () => {
    it('Shows expected property-names', () => {
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

    it('constructs correct filterQuery', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.EdgeTypes').click();
      cy.get('.FilterButton').eq(2).click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect').first().click();

      // Assert
      cy.contains('Error: No string').click();
      // eslint-disable-next-line
      cy.get('.ApplyFilter').focus().click({ force: true });
    });

    it('constructs correct filterQuery', () => {
      // Act
      cy.get('.Filter').click();
      cy.get('.EdgeTypes').click();
      cy.get('.FilterButton').eq(2).click();
      cy.get('.FilterDialog');
      cy.get('.FilterSelect').first().click();

      // Assert
      cy.contains('Error: No string').click();
      // eslint-disable-next-line
      cy.get('.ApplyFilter').focus().click({ force: true });

      cy.get('.AddButton').eq(2).click();
      cy.get('.AddButton').eq(2).click();
    });
  });
});
