export const keanuSearch = {
  search: {
    edges: [],
    nodes: [{ id: 1, properties: { name: 'Keanu Reeves' }, types: ['Person'] }],
    nodeTypes: [],
    edgeTypes: [],
  },
};
export const emptySearch = {
  search: {
    nodes: [],
    edges: [],
    nodeTypes: [],
    edgeTypes: [],
  },
};
export const customSearch = {
  search: {
    nodes: [{ id: 1, properties: { name: 'Keanu Reeves' }, types: ['Person'] }],
    edges: [{ id: 1, from: 3, to: 0, properties: {}, types: ['Person'] }],
    nodeTypes: [{ name: 'Person' }],
    edgeTypes: [{ name: 'ACTED_IN' }],
  },
};
