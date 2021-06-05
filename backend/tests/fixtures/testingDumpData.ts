import { Node } from '../../src/shared/entities/Node';
import { Edge } from '../../src/shared/entities/Edge';
import { QueryBase, QueryResult } from '../../src/shared/queries';

/**
 * Data that is used for testing in app.service.e2e.spec.ts and app.controller.spec.ts
 */

export const queryAllDummies: {
  query: QueryBase;
  queryResult: QueryResult;
} = {
  query: { limits: { nodes: 3, edges: 4 } },
  queryResult: {
    nodes: [
      { id: 0, types: ['Person'] },
      { id: 1, types: ['Person'] },
      { id: 2, types: ['Person'] },
    ],
    edges: [
      { id: 0, type: 'ACTED_IN', from: 1, to: 0 },
      { id: 1, type: 'ACTED_IN', from: 2, to: 0 },
    ],
  },
};

export const queryAllNoLimitDummies: {
  queryResult: QueryResult;
} = {
  queryResult: {
    nodes: [
      { id: 0, types: ['Person'] },
      { id: 1, types: ['Person'] },
      { id: 2, types: ['Person'] },
      { id: 3, types: ['Person'] },
    ],
    edges: [
      { id: 0, type: 'ACTED_IN', from: 1, to: 0 },
      { id: 1, type: 'ACTED_IN', from: 2, to: 0 },
      { id: 2, type: 'ACTED_IN', from: 3, to: 0 },
    ],
  },
};

export const getNodesByIdDummies: { ids: number[]; nodes: Node[] } = {
  ids: [1, 2, 3],
  nodes: [
    {
      id: 1,
      types: ['Person'],
      properties: { born: 1964, name: 'Keanu Reeves' },
    },
    {
      id: 2,
      types: ['Person'],
      properties: { born: 1967, name: 'Carrie-Anne Moss' },
    },
    {
      id: 3,
      types: ['Person'],
      properties: { born: 1965, name: 'Lana Wachowski' },
    },
  ],
};

export const getEdgesByIdDummies: { ids: number[]; edges: Edge[] } = {
  ids: [1, 2],
  edges: [
    {
      id: 1,
      from: 2,
      to: 0,
      properties: { roles: ['Trinity'] },
      type: 'ACTED_IN',
    },
    { id: 2, from: 3, to: 0, properties: {}, type: 'DIRECTED' },
  ],
};
