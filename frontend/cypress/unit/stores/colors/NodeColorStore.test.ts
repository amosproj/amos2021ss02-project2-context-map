import { NodeDescriptor } from '../../../../src/shared/entities';
import { EntityColorStore } from '../../../../src/stores/colors';

describe('NodeColorStore', () => {
  let nodeColorStore: EntityColorStore;
  const dummies: NodeDescriptor[] = [
    { id: 1, types: ['HELLO'] },
    { id: 2, types: ['WORLD'] },
    { id: 3, types: ['COMPOSED', 'KEY'] },
  ];

  beforeEach(() => {
    nodeColorStore = new EntityColorStore();
  });

  it('should return colors for types', () => {
    const colorizer = nodeColorStore.getValue();
    const colors = dummies.map((t) => colorizer.colorize(t));

    for (const color of colors) {
      expect(color.color).to.match(/#[0-9a-fA-F]{6}/);
    }
  });

  it('should return new colors for new types', () => {
    const colorizer = nodeColorStore.getValue();
    const colors = new Set(dummies.map((t) => colorizer.colorize(t)));

    expect(colors.size).to.be.eq(dummies.length);
  });

  it('should return the same color for the same type', () => {
    const colorizer = nodeColorStore.getValue();
    const numCalls = 5;

    const colors = new Array(numCalls).map(() =>
      colorizer.colorize(dummies[0])
    );

    expect(colors).to.have.length(numCalls);
    expect(new Set(colors).size).to.be.eq(1);
  });

  it('should return the same color independent of the type order', () => {
    const colorizer = nodeColorStore.getValue();
    const color1 = colorizer.colorize({ id: 1, types: ['HELLO', 'WORLD'] });
    const color2 = colorizer.colorize({ id: 2, types: ['WORLD', 'HELLO'] });

    expect(color1).to.deep.eq(color2);
  });

  it('should not alter the input array', () => {
    const colorizer = nodeColorStore.getValue();

    const dummy1: NodeDescriptor = { id: 1, types: ['A', 'B'] };
    colorizer.colorize(dummy1);
    expect(dummy1.types).to.have.ordered.members(['A', 'B']);

    const dummy2: NodeDescriptor = { id: 1, types: ['D', 'C'] };
    colorizer.colorize(dummy2);
    expect(dummy2.types).to.have.ordered.members(['D', 'C']);
  });
});
