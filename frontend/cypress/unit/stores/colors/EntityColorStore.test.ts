import {
  EdgeDescriptor,
  NodeDescriptor,
} from '../../../../src/shared/entities';
import { EntityColorStore } from '../../../../src/stores/colors';

describe('EntityColorStore', () => {
  let entityColorStore: EntityColorStore;
  const dummies: (EdgeDescriptor | NodeDescriptor)[] = [
    { id: 1, type: 'HELLO', from: 1, to: 1 },
    { id: 1, types: ['HELLO'] },
    { id: 2, types: ['FOO'] },
    { id: 3, types: ['BAR'] },
  ];

  beforeEach(() => {
    entityColorStore = new EntityColorStore();
  });

  it('should return different colors for different entity types', () => {
    const colorize = entityColorStore.getValue();
    const color1 = colorize(dummies[0]);
    const color2 = colorize(dummies[1]);

    expect(color1).not.to.be.deep.eq(color2);
  });

  it('should return grey for all node types when greyScale is true', () => {
    const colorize = entityColorStore.getValue();
    entityColorStore.setGreyScale(true);
    const grey = '#9e9e9e';
    const colors = [];
    colors.push(colorize(dummies[1]));
    colors.push(colorize(dummies[2]));
    colors.push(colorize(dummies[3]));

    for (const color of colors) {
      expect(color.color).to.be.eq(grey);
    }
  });
});
