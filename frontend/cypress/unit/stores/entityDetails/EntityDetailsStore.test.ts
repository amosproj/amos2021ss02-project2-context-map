import { id1, dummies } from '../../../fixtures/entityDetails/entityDetails';
import EntityDetails from '../../../../src/stores/details/EntityDetailsStore';
import { createContainer } from '../../../../src/dependency-injection/DependencyInjectionContext';
import EntityDetailsState from '../../../../src/stores/details/EntityDetailsStateStore';

describe('EntityDetailsStore', () => {
  // Global setup
  let entityDetails: EntityDetails;
  let entityDetailsState: EntityDetailsState;
  const container = createContainer();

  beforeEach(() => {
    entityDetails = container.get(EntityDetails);
    entityDetailsState = container.get(EntityDetailsState);
  });

  describe('Details store', () => {
    it('should initially return null', () => {
      // Act
      const actual = entityDetails.getValue();
      const expected = null;

      // Assert
      expect(actual).to.be.eq(expected);
    });
    it('should return details of the node with id 1', () => {
      // Arrange
      entityDetails = container.get(EntityDetails);
      cy.intercept('http://localhost:8080/api/getNodesById*', id1);
      entityDetailsState.setState({ node: 1, edge: null });

      // Act
      const actual = entityDetails.getValue();

      // Assert
      expect(actual).to.be.eq(id1);
    });
  });
});
