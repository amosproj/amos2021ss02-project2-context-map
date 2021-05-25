context('Filter', () => {
  // Global setup
  beforeEach(() => {
    cy.visit('http://localhost:3000/visualization/graph');
  });

  it('shows filter options', () => {
    // Act
    cy.get(
      '.makeStyles-filter-21 > :nth-child(1) > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click();
    // Assert
    cy.get(
      '.makeStyles-filter-21 > :nth-child(1) > .MuiDrawer-root > .MuiDrawer-paper > .MuiList-root'
    ).should('be.visible');
  });

  it('shows person filters', () => {
    // Act
    cy.get(
      '.makeStyles-filter-21 > :nth-child(1) > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click();
    cy.get(
      '.MuiBox-root-29 > .MuiTypography-root > :nth-child(1) > .MuiBox-root > :nth-child(1) > :nth-child(2) > .MuiIconButton-label > .MuiSvgIcon-root > path'
    ).click();
    // Assert
    cy.get('.makeStyles-form-49').should('be.visible');
  });

  it('shows movie filters', () => {
    // Act
    cy.get(
      '.makeStyles-filter-21 > :nth-child(1) > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click();
    cy.get(
      '.MuiBox-root-29 > .MuiTypography-root > :nth-child(2) > .MuiBox-root > :nth-child(1) > :nth-child(2) > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click();
    // Assert
    cy.get(
      '.MuiBox-root-29 > .MuiTypography-root > :nth-child(2) > .MuiBox-root > :nth-child(1) > :nth-child(2) > .MuiIconButton-label > .MuiSvgIcon-root'
    ).should('be.visible');
  });

  it('adds single person to the filter', () => {
    // Act
    cy.get(
      '.makeStyles-filter-21 > :nth-child(1) > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click();
    cy.get(
      '.MuiBox-root-29 > .MuiTypography-root > :nth-child(1) > .MuiBox-root > :nth-child(1) > :nth-child(2) > .MuiIconButton-label > .MuiSvgIcon-root > path'
    ).click();
    cy.get(
      ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root'
    ).click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('.MuiList-root > [tabindex="0"]').type('{esc}');
    // Assert
    cy.get(
      ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root'
    )
      .its('value')
      .should('eq', 'Keanu Reeves');
  });

  it('adds multiple persons to the filter', () => {
    // Act
    cy.get(
      '.makeStyles-filter-21 > :nth-child(1) > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click();
    cy.get(
      '.MuiBox-root-29 > .MuiTypography-root > :nth-child(1) > .MuiBox-root > :nth-child(1) > :nth-child(2) > .MuiIconButton-label > .MuiSvgIcon-root > path'
    ).click();
    cy.get(
      ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root'
    ).click();
    cy.get('[data-value="Keanu Reeves"]').click();
    cy.get('[data-value="Carrie-Anne Moss"]').click();
    cy.get('[data-value="Carrie-Anne Moss"]').type('{esc}');
    // Assert
    cy.get(
      ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root'
    ).should('have.text', 'Keanu Reeves, Carrie-Anne Moss');
  });

  it('shows edge type filters', () => {
    // Act
    cy.get(
      '.makeStyles-filter-21 > :nth-child(1) > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click();
    cy.get(
      '.MuiDrawer-paper > .MuiPaper-root > .MuiTabs-root > .MuiTabs-scroller > .MuiTabs-flexContainer > [tabindex="-1"] > .MuiTab-wrapper'
    ).click();
    // Assert
    cy.get('.MuiBox-root-31').should('be.visible');
  });
});
