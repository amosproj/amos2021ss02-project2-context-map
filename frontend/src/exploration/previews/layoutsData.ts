import { ExplorationWeight } from '../../stores/exploration';
import LayoutDefinition from './LayoutDefinition';

const layoutsData: Record<keyof ExplorationWeight, LayoutDefinition> = {
  C: {
    filename: 'structural-layout.png',
    description: 'Structural Layout',
    path: '/visualization/graph',
  },
  BC: {
    filename: 'empty-layout.png',
    description: 'Betweenness Centrality',
    path: '/visualization/schema', // TODO: change when layout added
  },
  H: {
    filename: 'hierarchical-layout.png',
    description: 'Hierarchical Layout',
    path: '/visualization/hierarchical',
  },
  R: {
    filename: 'empty-layout.png',
    description: 'Radial Layout',
    path: '/visualization/schema', // TODO: change when layout added
  },
  SP: {
    filename: 'empty-layout.png',
    description: 'Shortest Path',
    path: '/visualization/graph',
  },
  L: {
    filename: 'empty-layout.png',
    description: 'List Layout',
    path: '/visualization/schema', // TODO: change when layout added
  },
  P: {
    filename: 'empty-layout.png',
    description: 'Pie Chart',
    path: '/visualization/schema', // TODO: change when layout added
  },
};

export default layoutsData;
