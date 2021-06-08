import '../../support/index.js';

context('Shortest Path Menu', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000/visualization/graph');
  });

  it('contains all node ids', () => {
    // Act
    cy.get('.Filter').click();
    cy.get('.StartEndNode:first').click();

    // Assert
    cy.contains('0');
    cy.contains('1');
    cy.contains('2');
    cy.contains('3');

    // Act
    cy.get('.StartEndNode:last').click();

    // Assert
    cy.contains('0');
    cy.contains('1');
    cy.contains('2');
    cy.contains('3');
  });

  it('selects existing start and end node', () => {
    // Act
    cy.get('.Filter').click();
    cy.get('.StartEndNode:first').click();

    // Assert
    cy.contains('1').click();

    // Act
    cy.get('.StartEndNode:last').click();

    // Assert
    cy.contains('2').click();
  });

  it('types and selects existing start and end node', () => {
    // Act
    cy.get('.Filter').click();

    // Act & Assert
    cy.get('.StartEndNode:first').type('1');
    cy.contains('1').click();

    // Act & Assert
    cy.get('.StartEndNode:last').type('2');
    cy.contains('2').click();
  });

  it('types and selects non existing start and end node', () => {
    // Act
    cy.get('.Filter').click();

    // Act & Assert
    cy.get('.StartEndNode:first').type('42');
    cy.contains('42').should('not.exist');

    // Act & Assert
    cy.get('.StartEndNode:last').type('156');
    cy.contains('156').should('not.exist');
  });

  it('appears alert when no nodes are selected', () => {
    // Act
    cy.get('.Filter').click();
    cy.get('.StartShortestPath').click();

    // Assert
    cy.get('.ShortestPathNodesNotSpecified').then(($alert) =>
      $alert.is(':visible')
    );
  });

  it('appears alert when only one node is selected', () => {
    // Act
    cy.get('.Filter').click();
    cy.get('.StartEndNode:first').click();
    cy.contains('1').click();
    cy.get('.StartShortestPath').click();

    // Assert
    cy.get('.ShortestPathNodesNotSpecified').then(($alert) =>
      $alert.is(':visible')
    );
  });

  it('appears no alert when both nodes are selected', () => {
    // Act
    cy.get('.Filter').click();
    cy.get('.StartEndNode:first').click();
    cy.contains('1').click();
    cy.get('.StartEndNode:last').click();
    cy.contains('2').click();
    cy.get('.StartShortestPath').click();

    // Assert
    cy.get('.ShortestPathNodesNotSpecified').should('not.exist');
  });
});
