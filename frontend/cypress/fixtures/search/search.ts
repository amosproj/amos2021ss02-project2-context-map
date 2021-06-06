import { SearchResult } from '../../../src/shared/search';

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
export const longSearch: { search: SearchResult } = {
  search: {
    nodes: [],
    edges: [],
    nodeTypes: [1, 2, 3, 4, 5, 6, 7, 8].map((x) => ({
      name: `Dummy ${x}`,
    })),
    edgeTypes: [],
  },
};
