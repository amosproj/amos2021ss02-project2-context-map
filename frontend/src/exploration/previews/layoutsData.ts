import { ExplorationWeight } from '../../stores/exploration';
import LayoutDefinition from './LayoutDefinition';

/**
 * Gives a {@link LayoutDefinition} to every attribute of an {@link ExplorationWeight}.
 */
const layoutsData: Record<keyof ExplorationWeight, LayoutDefinition> = {
  C: {
    filename: 'structural-layout.png',
    description: 'Structural Layout',
    path: '/visualization/graph',
  },
  BC: {
    filename: 'betweenness-centrality.png',
    description: 'Betweenness Centrality',
    path: '/visualization/schema', // TODO #299: Add missing visualisation preview links
  },
  H: {
    filename: 'hierarchical-layout.png',
    description: 'Hierarchical Layout',
    path: '/visualization/hierarchical',
  },
  R: {
    filename: 'radial-layout.png',
    description: 'Radial Layout',
    path: '/visualization/schema', // TODO #299: Add missing visualisation preview links
  },
  SP: {
    filename: 'empty-layout.png',
    description: 'Shortest Path',
    path: '/visualization/graph',
  },
  L: {
    filename: 'data-table.png',
    description: 'List Layout',
    path: '/visualization/schema', // TODO #299: Add missing visualisation preview links
  },
  P: {
    filename: 'chord-diagram.png',
    description: 'Chord Diagram',
    path: '/visualization/chord',
  },
};

export default layoutsData;
