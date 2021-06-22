import { NodeDescriptor } from '../../../../src/shared/entities';
import { EntityStyleStore } from '../../../../src/stores/colors';
import SearchSelectionStore from '../../../../src/stores/SearchSelectionStore';

describe('NodeColorStore', () => {
  let entityStyleStore: EntityStyleStore;
  let searchSelectionStore: SearchSelectionStore;
  const dummies: NodeDescriptor[] = [
    { id: 1, types: ['HELLO'] },
    { id: 2, types: ['WORLD'] },
    { id: 3, types: ['COMPOSED', 'KEY'] },
  ];

  beforeEach(() => {
    searchSelectionStore = new SearchSelectionStore();
    entityStyleStore = new EntityStyleStore(searchSelectionStore);
  });

  it('should return colors for types', () => {
    const styleProvider = entityStyleStore.getValue();
    const colors = dummies.map((t) => styleProvider.getStyle(t));

    for (const color of colors) {
      expect(color.color).to.match(/#[0-9a-fA-F]{6}/);
    }
  });

  it('should return new colors for new types', () => {
    const styleProvider = entityStyleStore.getValue();
    const colors = new Set(dummies.map((t) => styleProvider.getStyle(t)));

    expect(colors.size).to.be.eq(dummies.length);
  });

  it('should return the same color for the same type', () => {
    const styleProvider = entityStyleStore.getValue();
    const numCalls = 5;

    const colors = new Array(numCalls).map(() =>
      styleProvider.getStyle(dummies[0])
    );

    expect(colors).to.have.length(numCalls);
    expect(new Set(colors).size).to.be.eq(1);
  });

  it('should return the same color independent of the type order', () => {
    const styleProvider = entityStyleStore.getValue();
    const color1 = styleProvider.getStyle({ id: 1, types: ['HELLO', 'WORLD'] });
    const color2 = styleProvider.getStyle({ id: 2, types: ['WORLD', 'HELLO'] });

    expect(color1).to.deep.eq(color2);
  });

  it('should not alter the input array', () => {
    const styleProvider = entityStyleStore.getValue();

    const dummy1: NodeDescriptor = { id: 1, types: ['A', 'B'] };
    styleProvider.getStyle(dummy1);
    expect(dummy1.types).to.have.ordered.members(['A', 'B']);

    const dummy2: NodeDescriptor = { id: 1, types: ['D', 'C'] };
    styleProvider.getStyle(dummy2);
    expect(dummy2.types).to.have.ordered.members(['D', 'C']);
  });
});
