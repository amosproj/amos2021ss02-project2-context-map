import { QueryResult } from '../../../shared/src/queries/QueryResult';

interface HasId {
  id: number;
}

function compareById<T extends HasId>(a: T, b: T) {
  return a.id - b.id;
}

function deduplicateEntities<T extends HasId>(
  nodes: T[],
  maintainOrder = true
): T[] {
  if (maintainOrder) {
    const seen: boolean[] = [];
    const result = nodes;
    for (let i = result.length - 1; i >= 0; i -= 1) {
      if (seen[result[i].id]) {
        // Found duplicate
        result.splice(i, 1);
      }
      seen[result[i].id] = true;
    }
    return result;
  }

  const result = nodes.sort(compareById);
  for (let i = result.length - 1; i > 0; i -= 1) {
    if (result[i].id === result[i - 1].id) {
      // Found duplicate
      result.splice(i, 1);
    }
  }
  return result;
}

/**
 * Consolidates the specified query result, such that it contains only edges
 * that's to and from nodes are included in the query-result.
 * @param queryResult The query-result to filter
 */
export default function consolidateQueryResult(
  queryResult: QueryResult
): QueryResult {
  const { nodes, edges } = queryResult;
  const dedupNodes = deduplicateEntities(nodes, false);
  const dedupEdges = deduplicateEntities(edges, false);
  const nodeIds = new Set<number>(
    dedupNodes.map((descriptor) => descriptor.id)
  );

  for (let i = dedupEdges.length - 1; i >= 0; i -= 1) {
    const edge = dedupEdges[i];
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      dedupEdges.splice(i, 1);
    }
  }

  return {
    nodes: dedupNodes,
    edges: dedupEdges,
  };
}
