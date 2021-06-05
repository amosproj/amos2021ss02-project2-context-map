import NodeColorStore from '../../../../src/stores/colors/NodeColorStore';

describe('NodeColorStore', () => {
  let nodeColorStore: NodeColorStore;
  const types = [['HELLO'], ['WORLD'], ['COMPOSED', 'KEY']];

  beforeEach(() => {
    nodeColorStore = new NodeColorStore();
  });

  it('should return colors for types', () => {
    const colorize = nodeColorStore.getValue();
    const colors = types.map((t) => colorize(t));

    for (const color of colors) {
      expect(color.color).to.match(/#[0-9a-fA-F]{6}/);
    }
  });

  it('should return new colors for new types', () => {
    const colorize = nodeColorStore.getValue();
    const colors = new Set(types.map((t) => colorize(t)));

    expect(colors.size).to.be.eq(types.length);
  });

  it('should return the same color for the same type', () => {
    const colorize = nodeColorStore.getValue();
    const numCalls = 5;

    const colors = new Array(numCalls).map(() => colorize(['MyType']));

    expect(colors).to.have.length(numCalls);
    expect(new Set(colors).size).to.be.eq(1);
  });

  it('should return the same color independent of the type order', () => {
    const colorize = nodeColorStore.getValue();
    const color1 = colorize(['HELLO', 'WORLD']);
    const color2 = colorize(['WORLD', 'HELLO']);

    expect(color1).to.deep.eq(color2);
  });

  it('should not alter the input array', () => {
    const colorize = nodeColorStore.getValue();

    const arr1 = ['A', 'B'];
    colorize(arr1);
    expect(arr1).to.have.ordered.members(['A', 'B']);

    const arr2 = ['D', 'C'];
    colorize(arr2);
    expect(arr2).to.have.ordered.members(['D', 'C']);
  });
});
