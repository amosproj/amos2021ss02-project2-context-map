import { QueryResult } from '../shared/queries/QueryResult';

/**
 * Consolidates the specified query result, such that it contains only edges
 * that's to and from nodes are included in the query-result.
 * @param queryResult The query-result to filter
 */
export default function consolidateQueryResult(
  queryResult: QueryResult
): QueryResult {
  const nodeIds = new Set<number>(
    queryResult.nodes.map((descriptor) => descriptor.id)
  );
  const { edges } = queryResult;

  for (let i = edges.length - 1; i >= 0; i -= 1) {
    const edge = edges[i];
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      edges.splice(i, 1);
    }
  }

  return {
    nodes: queryResult.nodes,
    edges,
  };
}
