import EdgeColorStore from '../../../../src/stores/colors/EdgeColorStore';

describe('EdgeColorStore', () => {
  let edgeColorStore: EdgeColorStore;
  const types = ['HELLO', 'WORLD', 'ANOTHER', 'KEY'];

  beforeEach(() => {
    edgeColorStore = new EdgeColorStore();
  });

  it('should return colors for types', () => {
    const colorize = edgeColorStore.getValue();
    const colors = types.map((t) => colorize(t));

    for (const color of colors) {
      expect(color.color).to.match(/#[0-9a-fA-F]{6}/);
    }
  });

  it('should return new colors for new types', () => {
    const colorize = edgeColorStore.getValue();
    const colors = new Set(types.map((t) => colorize(t)));

    expect(colors.size).to.be.eq(types.length);
  });

  it('should return the same color for the same type', () => {
    const colorize = edgeColorStore.getValue();
    const numCalls = 5;

    const colors = new Array(numCalls).map(() => colorize('MyType'));

    expect(colors).to.have.length(numCalls);
    expect(new Set(colors).size).to.be.eq(1);
  });
});
