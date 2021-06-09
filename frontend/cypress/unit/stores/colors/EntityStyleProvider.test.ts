import {
  EdgeDescriptor,
  NodeDescriptor,
} from '../../../../src/shared/entities';
import {
  // EntityStyleMonitor,
  EntityStyleProvider,
  EntityStyleStateStore,
} from '../../../../src/stores/colors';
import { EntityStyleProviderImpl } from '../../../../src/stores/colors/EntityStyleProviderImpl';

describe('EntityStyleProvider', () => {
  const styleStore = new EntityStyleStateStore();
  let styleProvider: EntityStyleProvider;
  // let styleMonitor: EntityStyleMonitor;

  const edgeDummies: EdgeDescriptor[] = [
    { id: 1, type: 'HELLO', from: 1, to: 1 },
    { id: 2, type: 'WORLD', from: 2, to: 2 },
    { id: 3, type: 'ANOTHER', from: 3, to: 3 },
    { id: 4, type: 'KEY', from: 4, to: 4 },
  ];

  const nodeDummies: NodeDescriptor[] = [
    { id: 1, types: ['HELLO'] },
    { id: 2, types: ['WORLD'] },
    { id: 3, types: ['COMPOSED', 'KEY'] },
  ];

  beforeEach(() => {
    styleProvider = EntityStyleProviderImpl.create(styleStore);
    // styleMonitor = new EntityStyleMonitor(styleStore, styleProvider);
  });

  it('should return colors for types', () => {
    const colors = edgeDummies.map((t) => styleProvider.getStyle(t));

    for (const color of colors) {
      expect(color.color).to.match(/#[0-9a-fA-F]{6}/);
    }
  });

  it('should return new colors for new types', () => {
    const colors = new Set(edgeDummies.map((t) => styleProvider.getStyle(t)));

    expect(colors.size).to.be.eq(edgeDummies.length);
  });

  it('should return the same color for the same type', () => {
    const numCalls = 5;

    const colors = new Array(numCalls).map(() =>
      styleProvider.getStyle(edgeDummies[0])
    );

    expect(colors).to.have.length(numCalls);
    expect(new Set(colors).size).to.be.eq(1);
  });

  it('should return black for all edge types when greyScale is true', () => {
    styleStore.mergeState({ greyScaleEdges: true });
    const black = '#000';
    const colors = edgeDummies.map((t) => styleProvider.getStyle(t));

    for (const color of colors) {
      expect(color.color).to.be.eq(black);
    }
  });

  it('should return different colors for different entity types', () => {
    const color1 = styleProvider.getStyle(edgeDummies[0]);
    const color2 = styleProvider.getStyle(nodeDummies[1]);

    expect(color1).not.to.be.deep.eq(color2);
  });

  it('should return colors for types', () => {
    const colors = nodeDummies.map((t) => styleProvider.getStyle(t));

    for (const color of colors) {
      expect(color.color).to.match(/#[0-9a-fA-F]{6}/);
    }
  });

  it('should return new colors for new types', () => {
    const colors = new Set(nodeDummies.map((t) => styleProvider.getStyle(t)));

    expect(colors.size).to.be.eq(nodeDummies.length);
  });

  it('should return the same color for the same type', () => {
    const numCalls = 5;

    const colors = new Array(numCalls).map(() =>
      styleProvider.getStyle(nodeDummies[0])
    );

    expect(colors).to.have.length(numCalls);
    expect(new Set(colors).size).to.be.eq(1);
  });

  it('should return the same color independent of the type order', () => {
    const color1 = styleProvider.getStyle({ id: 1, types: ['HELLO', 'WORLD'] });
    const color2 = styleProvider.getStyle({ id: 2, types: ['WORLD', 'HELLO'] });

    expect(color1).to.deep.eq(color2);
  });

  it('should not alter the input array', () => {
    const dummy1: NodeDescriptor = { id: 1, types: ['A', 'B'] };
    styleProvider.getStyle(dummy1);
    expect(dummy1.types).to.have.ordered.members(['A', 'B']);

    const dummy2: NodeDescriptor = { id: 1, types: ['D', 'C'] };
    styleProvider.getStyle(dummy2);
    expect(dummy2.types).to.have.ordered.members(['D', 'C']);
  });
});
