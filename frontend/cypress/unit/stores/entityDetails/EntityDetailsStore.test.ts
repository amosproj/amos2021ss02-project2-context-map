import {
  edgeId1,
  nodeId1,
} from '../../../fixtures/entityDetails/entityDetails';
import EntityDetails from '../../../../src/stores/details/EntityDetailsStore';
import { createContainer } from '../../../../src/dependency-injection/DependencyInjectionContext';
import EntityDetailsState from '../../../../src/stores/details/EntityDetailsStateStore';
import { QueryService } from '../../../../src/services/query';
import QueryServiceFake from '../../../fixtures/QueryServiceFake';

describe('EntityDetailsStore', () => {
  // Global setup
  let entityDetails: EntityDetails;
  let entityDetailsState: EntityDetailsState;
  const container = createContainer();

  beforeEach(() => {
    container.unbind(QueryService);
    container.bind(QueryService).to(QueryServiceFake);
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
      entityDetailsState.setState({ node: 1, edge: null });

      // Act
      const actual = entityDetails.getValue();

      // Assert
      expect(actual).to.be.deep.eq(nodeId1);
    });
    it('should return details of the edge with id 1', () => {
      // Arrange
      entityDetailsState.setState({ node: null, edge: 1 });

      // Act
      const actual = entityDetails.getValue();

      // Assert
      expect(actual).to.be.deep.eq(edgeId1);
    });
  });
});
