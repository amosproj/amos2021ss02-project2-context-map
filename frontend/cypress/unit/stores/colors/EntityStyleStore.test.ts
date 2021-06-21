import {
  EdgeDescriptor,
  NodeDescriptor,
} from '../../../../src/shared/entities';
import { EntityStyleStore } from '../../../../src/stores/colors';
import SearchSelectionStore, {
  SelectedSearchResult,
} from '../../../../src/stores/SearchSelectionStore';

describe('EntityStyleStore', () => {
  let entityStyleStore: EntityStyleStore;
  let searchSelectionStore: SearchSelectionStore;
  const entityDummies: (EdgeDescriptor | NodeDescriptor)[] = [
    { id: 1, type: 'EDGE', from: 1, to: 1 },
    { id: 2, type: 'EDGE', from: 2, to: 2 },
    { id: 1, types: ['NODE'] },
    { id: 2, types: ['NODE'] },
  ];

  const searchSelectionDummies: SelectedSearchResult[] = [
    { id: 1, type: 'EDGE', from: 1, to: 1, interfaceType: 'EdgeDescriptor' },
    { id: 2, type: 'EDGE', from: 2, to: 2, interfaceType: 'EdgeDescriptor' },
    { id: 1, types: ['NODE'], interfaceType: 'NodeDescriptor' },
    { id: 2, types: ['NODE'], interfaceType: 'NodeDescriptor' },
    { name: 'EDGE', interfaceType: 'EdgeTypeDescriptor' },
    { name: 'NODE', interfaceType: 'NodeTypeDescriptor' },
  ];

  beforeEach(() => {
    searchSelectionStore = new SearchSelectionStore();
    entityStyleStore = new EntityStyleStore(searchSelectionStore);
  });

  it('should return different colors for different entity types', () => {
    const styleProvider = entityStyleStore.getValue();
    const color1 = styleProvider.getStyle(entityDummies[0] as EdgeDescriptor);
    const color2 = styleProvider.getStyle(entityDummies[2] as NodeDescriptor);

    expect(color1).not.to.be.deep.eq(color2);
  });

  context('change stroke width', () => {
    it('should change stroke width for a single edge search selection update', () => {
      searchSelectionStore.setState(searchSelectionDummies[0]);

      const styleProvider = entityStyleStore.getValue();

      const edgeStyle = styleProvider.getStyle(
        entityDummies[0] as EdgeDescriptor
      );

      expect(edgeStyle.stroke.width).to.be.eq(5);
    });

    it('should change stroke width for a single node search selection update', () => {
      searchSelectionStore.setState(searchSelectionDummies[2]);

      const styleProvider = entityStyleStore.getValue();

      const nodeStyle = styleProvider.getStyle(
        entityDummies[2] as NodeDescriptor
      );

      expect(nodeStyle.stroke.width).to.be.eq(5);
    });

    it('should change stroke width for an edge type search selection update', () => {
      searchSelectionStore.setState(searchSelectionDummies[4]);

      const styleProvider = entityStyleStore.getValue();

      const edgeStyle1 = styleProvider.getStyle(
        entityDummies[0] as NodeDescriptor
      );

      const edgeStyle2 = styleProvider.getStyle(
        entityDummies[1] as NodeDescriptor
      );

      expect(edgeStyle1.stroke.width).to.be.eq(5);
      expect(edgeStyle2.stroke.width).to.be.eq(5);
    });

    it('should change stroke width for a node type search selection update', () => {
      searchSelectionStore.setState(searchSelectionDummies[5]);

      const styleProvider = entityStyleStore.getValue();

      const nodeStyle1 = styleProvider.getStyle(
        entityDummies[2] as NodeDescriptor
      );

      const nodeStyle2 = styleProvider.getStyle(
        entityDummies[3] as NodeDescriptor
      );

      expect(nodeStyle1.stroke.width).to.be.eq(5);
      expect(nodeStyle2.stroke.width).to.be.eq(5);
    });
  });
});
