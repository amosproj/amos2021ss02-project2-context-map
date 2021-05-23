export const keanuSearch = {
  search: {
    nodes: [
      {
        id: 1,
      },
    ],
    edges: [],
    nodeTypes: [],
    edgeTypes: [],
  },
  getNodesById: [
    {
      id: 1,
      types: ['Person'],
      properties: {
        born: 1964,
        name: 'Keanu Reeves',
      },
    },
  ],
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
    nodes: [
      {
        id: 1,
      },
    ],
    edges: [
      {
        id: 1,
      },
    ],
    nodeTypes: [{ name: 'Person' }],
    edgeTypes: [{ name: 'ACTED_IN' }],
  },
  getNodesById: [
    {
      id: 1,
      types: ['Person'],
      properties: {
        born: 1964,
        name: 'Keanu Reeves',
      },
    },
  ],
  getEdgesById: [{ id: 2, from: 3, to: 0, properties: {}, type: 'DIRECTED' }],
};
