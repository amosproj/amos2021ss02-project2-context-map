import {
  FilterCondition,
  FilterQuery,
  MatchAllCondition,
  MatchAnyCondition,
} from '../../shared/queries';

export default function addToFilterQuery(
  filterCondition: FilterCondition,
  filterQuery: FilterQuery,
  entity: 'node' | 'edge',
  allOrAny: 'all' | 'any'
): FilterQuery {
  const allOrAnyCondition:
    | ((...filters: FilterCondition[]) => MatchAllCondition)
    | ((...filters: FilterCondition[]) => MatchAnyCondition) =
    allOrAny === 'all' ? MatchAllCondition : MatchAnyCondition;

  const { filters } = filterQuery;
  let result: FilterQuery;
  if (entity === 'node') {
    if (filters) {
      const newNodes: FilterCondition = filters.nodes
        ? allOrAnyCondition(filters.nodes, filterCondition)
        : filterCondition;

      result = {
        filters: {
          nodes: newNodes,
          edges: filters.edges,
        },
      };
    } else {
      result = {
        filters: {
          nodes: filterCondition,
          edges: undefined,
        },
      };
    }
  } else if (filters) {
    const newEdges: FilterCondition = filters.edges
      ? allOrAnyCondition(filters.edges, filterCondition)
      : filterCondition;

    result = {
      filters: {
        nodes: filters.nodes,
        edges: newEdges,
      },
    };
  } else {
    result = {
      filters: {
        nodes: undefined,
        edges: filterCondition,
      },
    };
  }

  return result;
}
