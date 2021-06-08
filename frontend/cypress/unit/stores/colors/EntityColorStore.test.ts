import {
  EdgeDescriptor,
  NodeDescriptor,
} from '../../../../src/shared/entities';
import { EntityStyleStore } from '../../../../src/stores/colors';

describe('EntityColorStore', () => {
  let entityColorStore: EntityStyleStore;
  const dummies: (EdgeDescriptor | NodeDescriptor)[] = [
    { id: 1, type: 'HELLO', from: 1, to: 1 },
    { id: 1, types: ['HELLO'] },
  ];

  beforeEach(() => {
    entityColorStore = new EntityStyleStore();
  });

  it('should return different colors for different entity types', () => {
    const colorize = entityColorStore.getValue();
    const color1 = colorize(dummies[0]);
    const color2 = colorize(dummies[1]);

    expect(color1).not.to.be.deep.eq(color2);
  });
});
