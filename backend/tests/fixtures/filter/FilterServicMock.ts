import { FilterQuery, QueryResult } from '../../../src/shared/queries';
import { FilterServiceBase } from '../../../src/filter/filter.service.base';
import {
  EdgeTypeFilterModel,
  NodeTypeFilterModel,
} from '../../../src/shared/filter';
import {
  getEdgeTypeFilterModelResult,
  getNodeTypeFilterModelResult,
} from './FilterQueryResults';
import { NodeFilterConditionExecutor } from '../../../src/filter/NodeFilterConditionExecutor';
import { EdgeFilterConditionExecutor } from '../../../src/filter/EdgeFilterConditionExecutor';
import { consolidateQueryResult } from '../../../src/utils';

const nodes = [
  {
    id: 0,
    types: ['Movie'],
    properties: {
      tagline: 'Welcome to the Real World',
      title: 'The Matrix',
      released: 1999,
    },
  },
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
];

const edges = [
  {
    id: 0,
    from: 1,
    to: 0,
    properties: { roles: ['Neo'] },
    type: 'ACTED_IN',
  },
  {
    id: 1,
    from: 2,
    to: 0,
    properties: { roles: ['Trinity'] },
    type: 'ACTED_IN',
  },
  { id: 2, from: 3, to: 0, properties: {}, type: 'DIRECTED' },
];

export default class FilterServiceMock implements FilterServiceBase {
  // eslint-disable-next-line class-methods-use-this
  public query(query?: FilterQuery): Promise<QueryResult> {
    const nodeFilterExecutor = new NodeFilterConditionExecutor();
    const edgeFilterExecutor = new EdgeFilterConditionExecutor();

    const filteredNodes = query?.filters?.nodes
      ? nodeFilterExecutor.filterNodes(nodes, query?.filters?.nodes)
      : nodes;

    const filteredEdges = query?.filters?.edges
      ? edgeFilterExecutor.filterEdges(edges, query?.filters?.edges)
      : edges;

    const result = {
      nodes: filteredNodes.map((node) => ({ id: node.id })),
      edges: filteredEdges.map((edge) => ({
        id: edge.id,
        from: edge.from,
        to: edge.to,
      })),
    };
    return Promise.resolve(consolidateQueryResult(result));
  }

  // eslint-disable-next-line class-methods-use-this
  public getNodeTypeFilterModel(type: string): Promise<NodeTypeFilterModel> {
    let result: NodeTypeFilterModel = {
      name: type,
      properties: [],
    };

    if (type === 'Movie') {
      result = getNodeTypeFilterModelResult;
    }

    return Promise.resolve(result);
  }

  // eslint-disable-next-line class-methods-use-this
  public getEdgeTypeFilterModel(type: string): Promise<EdgeTypeFilterModel> {
    let result: EdgeTypeFilterModel = {
      name: type,
      properties: [],
    };

    if (type === 'ACTED_IN') {
      result = getEdgeTypeFilterModelResult;
    }

    return Promise.resolve(result);
  }
}
