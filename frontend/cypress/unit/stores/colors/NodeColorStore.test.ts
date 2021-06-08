import { NodeDescriptor } from '../../../../src/shared/entities';
import { EntityStyleStore } from '../../../../src/stores/colors';

describe('NodeColorStore', () => {
  let nodeColorStore: EntityStyleStore;
  const dummies: NodeDescriptor[] = [
    { id: 1, types: ['HELLO'] },
    { id: 2, types: ['WORLD'] },
    { id: 3, types: ['COMPOSED', 'KEY'] },
  ];

  beforeEach(() => {
    nodeColorStore = new EntityStyleStore();
  });

  it('should return colors for types', () => {
    const colorize = nodeColorStore.getValue();
    const colors = dummies.map((t) => colorize(t));

    for (const color of colors) {
      expect(color.color).to.match(/#[0-9a-fA-F]{6}/);
    }
  });

  it('should return new colors for new types', () => {
    const colorize = nodeColorStore.getValue();
    const colors = new Set(dummies.map((t) => colorize(t)));

    expect(colors.size).to.be.eq(dummies.length);
  });

  it('should return the same color for the same type', () => {
    const colorize = nodeColorStore.getValue();
    const numCalls = 5;

    const colors = new Array(numCalls).map(() => colorize(dummies[0]));

    expect(colors).to.have.length(numCalls);
    expect(new Set(colors).size).to.be.eq(1);
  });

  it('should return the same color independent of the type order', () => {
    const colorize = nodeColorStore.getValue();
    const color1 = colorize({ id: 1, types: ['HELLO', 'WORLD'] });
    const color2 = colorize({ id: 2, types: ['WORLD', 'HELLO'] });

    expect(color1).to.deep.eq(color2);
  });

  it('should not alter the input array', () => {
    const colorize = nodeColorStore.getValue();

    const dummy1: NodeDescriptor = { id: 1, types: ['A', 'B'] };
    colorize(dummy1);
    expect(dummy1.types).to.have.ordered.members(['A', 'B']);

    const dummy2: NodeDescriptor = { id: 1, types: ['D', 'C'] };
    colorize(dummy2);
    expect(dummy2.types).to.have.ordered.members(['D', 'C']);
  });
});
