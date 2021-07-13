import { NodeDetails } from '../../../../src/stores/details/NodeDetails';
import { Edge, Node } from '../../../../src/shared/entities';
import { EdgeDetails } from '../../../../src/stores/details/EdgeDetails';

describe('EntityDetails Functions', () => {
  describe('Node Details', () => {
    it('should return null on input null', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(NodeDetails(null)).to.be.null;
    });

    it('should add type information', () => {
      const node: Node = {
        id: 42,
        types: ['Person'],
        properties: {
          key: 'value',
        },
      };
      const actual = NodeDetails(node);
      expect(actual).to.deep.equal({
        entityType: 'node',
        id: 42,
        types: ['Person'],
        properties: {
          key: 'value',
        },
      });
    });
  });

  describe('Edge Details', () => {
    it('should return null on input null', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(EdgeDetails(null)).to.be.null;
    });

    it('should add type information', () => {
      const edge: Edge = {
        id: 42,
        type: 'knows',
        from: 1,
        to: 2,
        properties: {
          key: 'value',
        },
      };
      const actual = EdgeDetails(edge);
      expect(actual).to.deep.equal({
        entityType: 'edge',
        id: 42,
        type: 'knows',
        from: 1,
        to: 2,
        properties: {
          key: 'value',
        },
      });
    });
  });
});
