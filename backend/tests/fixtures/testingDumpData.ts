import { Node } from '../../../shared/src/entities/Node';
import { Edge } from '../../../shared/src/entities/Edge';
import { LimitQuery } from '../../../shared/src/queries/LimitQuery';
import { QueryResult } from '../../../shared/src/queries/QueryResult';

/**
 * Data that is used for testing in app.service.e2e.spec.ts and app.controller.spec.ts
 */

export const queryAllDummies: {
  limitQuery: LimitQuery;
  queryResult: QueryResult;
} = {
  limitQuery: { limit: { nodes: 3, edges: 4 } },
  queryResult: {
    nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
    edges: [
      { id: 0, from: 1, to: 0 },
      { id: 1, from: 2, to: 0 },
    ],
  },
};

export const queryAllNoLimitDummies: {
  queryResult: QueryResult;
} = {
  queryResult: {
    nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
    edges: [
      { id: 0, from: 1, to: 0 },
      { id: 1, from: 2, to: 0 },
      { id: 2, from: 3, to: 0 },
    ],
  },
};

export const getNodesByIdDummies: { ids: number[]; nodes: Node[] } = {
  ids: [1, 2, 3],
  nodes: [
    {
      id: 1,
      labels: ['Person'],
      properties: { born: 1964, name: 'Keanu Reeves' },
    },
    {
      id: 2,
      labels: ['Person'],
      properties: { born: 1967, name: 'Carrie-Anne Moss' },
    },
    {
      id: 3,
      labels: ['Person'],
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
