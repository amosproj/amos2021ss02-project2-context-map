import { EdgeDescriptor } from '../../../../src/shared/entities';
import { EntityColorStore } from '../../../../src/stores/colors';

describe('EdgeColorStore', () => {
  let edgeColorStore: EntityColorStore;
  const dummies: EdgeDescriptor[] = [
    { id: 1, type: 'HELLO', from: 1, to: 1 },
    { id: 2, type: 'WORLD', from: 2, to: 2 },
    { id: 3, type: 'ANOTHER', from: 3, to: 3 },
    { id: 4, type: 'KEY', from: 4, to: 4 },
  ];

  beforeEach(() => {
    edgeColorStore = new EntityColorStore();
  });

  it('should return colors for types', () => {
    const colorizer = edgeColorStore.getValue();
    const colors = dummies.map((t) => colorizer.colorize(t));

    for (const color of colors) {
      expect(color.color).to.match(/#[0-9a-fA-F]{6}/);
    }
  });

  it('should return new colors for new types', () => {
    const colorizer = edgeColorStore.getValue();
    const colors = new Set(dummies.map((t) => colorizer.colorize(t)));

    expect(colors.size).to.be.eq(dummies.length);
  });

  it('should return the same color for the same type', () => {
    const colorizer = edgeColorStore.getValue();
    const numCalls = 5;

    const colors = new Array(numCalls).map(() =>
      colorizer.colorize(dummies[0])
    );

    expect(colors).to.have.length(numCalls);
    expect(new Set(colors).size).to.be.eq(1);
  });

  it('should return black for all edge types when greyScale is true', () => {
    const colorizer = edgeColorStore.getValue();
    edgeColorStore.setGreyScaleEdges(true);
    const black = '#000';
    const colors = dummies.map((t) => colorizer.colorize(t));

    for (const color of colors) {
      expect(color.color).to.be.eq(black);
    }
  });
});
