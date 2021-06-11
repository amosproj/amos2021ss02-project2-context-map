type LayoutData = { text: string; description: string; weight: number };

export const layoutsData: {
  [key: string]: LayoutData;
} = {
  C: { text: 'structural layout', description: 'Structural Layout', weight: 0 },
  BC: {
    text: 'empty layout',
    description: 'Betweenness Centrality',
    weight: 0,
  },
  H: {
    text: 'hierarchical layout',
    description: 'Hierarchical Layout',
    weight: 0,
  },
  R: { text: 'empty layout', description: 'Radial Layout', weight: 0 },
  SP: { text: 'empty layout', description: 'Shortest Path', weight: 0 },
  L: { text: 'empty layout', description: 'List Layout', weight: 0 },
  P: { text: 'empty layout', description: 'Pie Chart', weight: 0 },
};

export default layoutsData;
