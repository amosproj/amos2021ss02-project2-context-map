import TabDefinition from '../../routing/TabDefinition';
import LayoutDefinition from './LayoutDefinition';

type LayoutData = {
  label: string;
  filename: string;
  description: string;
  weight: number;
};

export const layoutsData: {
  [key: string]: LayoutData;
} = {
  C: {
    label: 'Graph',
    filename: 'structural layout',
    description: 'Structural Layout',
    weight: 0,
  },
  BC: {
    label: 'Schema', // TODO: change when Betweenness Centrality is added
    filename: 'empty layout',
    description: 'Betweenness Centrality',
    weight: 0,
  },
  H: {
    label: 'Hierarchies',
    filename: 'hierarchical layout',
    description: 'Hierarchical Layout',
    weight: 0,
  },
  R: {
    label: 'Schema', // TODO: change when Radial Layout is added
    filename: 'empty layout',
    description: 'Radial Layout',
    weight: 0,
  },
  SP: {
    label: 'Graph',
    filename: 'empty layout',
    description: 'Shortest Path',
    weight: 0,
  },
  L: {
    label: 'Schema', // TODO: change when List Layout is added
    filename: 'empty layout',
    description: 'List Layout',
    weight: 0,
  },
  P: {
    label: 'Schema', // TODO: change when Pie Chart is added
    filename: 'empty layout',
    description: 'Pie Chart',
    weight: 0,
  },
};

const createLayoutCard = (
  layoutData: LayoutData,
  tabs: TabDefinition[]
): LayoutDefinition => {
  const tab = tabs.find((curTab) => curTab.label === layoutData.label);

  /* istanbul ignore if */
  if (tab === undefined) {
    throw new Error(`No tab found to label ${layoutData.label}`);
  }

  return {
    label: tab.label,
    path: tab.path,
    content: tab.content,
    description: layoutData.description,
    filename: layoutData.filename,
  };
};

export default createLayoutCard;
