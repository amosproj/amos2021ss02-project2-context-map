import { QueryNodeResult, QueryResult } from '../shared/queries';

interface HasId {
  id: number;
}

/**
 * Compared to entities via their id property.
 */
function compareById<T extends HasId>(a: T, b: T) {
  return a.id - b.id;
}

/**
 * Deduplicates an array of entities via their id property.
 * @param nodes The array of entities to deduplicate.
 * @param maintainOrder A boolean indicating whether to maintain the order of the entities.
 * @returns An array of entities without duplicates.
 */
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
 * @param includeSubsidiary A boolean value that indicated whether nodes that are not part of the result but references by edges that are part of the results shall be added or the referencing edges deleted.
 */
export function consolidateQueryResult(
  queryResult: QueryResult,
  includeSubsidiary = false
): QueryResult {
  const { nodes, edges } = queryResult;
  const dedupNodes = deduplicateEntities(nodes, false);
  const dedupEdges = deduplicateEntities(edges, false);
  const nodeIds = new Set<number>(
    dedupNodes.map((descriptor) => descriptor.id)
  );
  const subsidiary: QueryNodeResult[] = [];

  for (let i = dedupEdges.length - 1; i >= 0; i -= 1) {
    const edge = dedupEdges[i];

    if (includeSubsidiary) {
      if (!nodeIds.has(edge.from)) {
        nodeIds.add(edge.from);
        subsidiary.push({
          id: edge.from,
          types: [], // types of subsidiary nodes are unknown, color is special
          subsidiary: true,
        });
      }

      if (!nodeIds.has(edge.to)) {
        nodeIds.add(edge.to);
        subsidiary.push({
          id: edge.to,
          types: [], // types of subsidiary nodes are unknown, color is special
          subsidiary: true,
        });
      }
    } else if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      dedupEdges.splice(i, 1);
    }
  }

  return {
    nodes: [...dedupNodes, ...subsidiary],
    edges: dedupEdges,
  };
}
