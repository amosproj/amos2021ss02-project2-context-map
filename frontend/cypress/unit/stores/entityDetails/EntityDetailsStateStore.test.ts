import ContainerBuilder from '../../../../src/dependency-injection/ContainerBuilder';
import EntityDetailsState from '../../../../src/stores/details/EntityDetailsStateStore';

describe('EntityDetailsStateStore', () => {
  let entityDetailsStateStore: EntityDetailsState;
  const containerBuilder = new ContainerBuilder();
  const container = containerBuilder.buildContainer();

  beforeEach(() => {
    entityDetailsStateStore = container.get(EntityDetailsState);
  });

  describe('Details state store', () => {
    it('should initially be null', () => {
      expect(
        cy
          .wrap(entityDetailsStateStore.getValue())
          .its('node')
          .should('eq', null)
      );
    });
    it("should return the Node's id", () => {
      entityDetailsStateStore.showNode(1);
      expect(
        cy.wrap(entityDetailsStateStore.getValue()).its('node').should('eq', 1)
      );
    });
    it("Should return the edge's id", () => {
      entityDetailsStateStore.showEdge(2);
      expect(
        cy.wrap(entityDetailsStateStore.getValue()).its('edge').should('eq', 2)
      );
    });
    it('should be clearable', () => {
      entityDetailsStateStore.showNode(1);
      entityDetailsStateStore.clear();
      expect(
        cy
          .wrap(entityDetailsStateStore.getValue())
          .its('node')
          .should('eq', null)
      );
      expect(
        cy
          .wrap(entityDetailsStateStore.getValue())
          .its('edge')
          .should('eq', null)
      );
    });
  });
});
