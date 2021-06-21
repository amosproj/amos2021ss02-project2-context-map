import {
  EdgeDescriptor,
  NodeDescriptor,
} from '../../../../src/shared/entities';
import { EntityStyleStore } from '../../../../src/stores/colors';
import SearchSelectionStore from '../../../../src/stores/SearchSelectionStore';

describe('EntityColorStore', () => {
  let entityStyleStore: EntityStyleStore;
  let searchSelectionStore: SearchSelectionStore;
  const dummies: (EdgeDescriptor | NodeDescriptor)[] = [
    { id: 1, type: 'HELLO', from: 1, to: 1 },
    { id: 1, types: ['HELLO'] },
  ];

  beforeEach(() => {
    searchSelectionStore = new SearchSelectionStore();
    entityStyleStore = new EntityStyleStore(searchSelectionStore);
  });

  it('should return different colors for different entity types', () => {
    const styleProvider = entityStyleStore.getValue();
    const color1 = styleProvider.getStyle(dummies[0] as EdgeDescriptor);
    const color2 = styleProvider.getStyle(dummies[1] as NodeDescriptor);

    expect(color1).not.to.be.deep.eq(color2);
  });
});
