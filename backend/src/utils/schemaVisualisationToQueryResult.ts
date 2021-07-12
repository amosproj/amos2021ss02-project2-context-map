import { QueryResult } from '../shared/queries';

/**
 * Defines the return type coming from the cypher query
 * 'CALL db.schema.visualisation()'
 */
export type SchemaVisualisationResult = {
  nodes: {
    identity: number;
    labels: [string];
    [key: string]: unknown;
  }[];
  relationships: {
    identity: number;
    type: string;
    start: number;
    end: number;
    [key: string]: unknown;
  }[];
};

/**
 * Maps object of type {@link SchemaVisualisationResult} to {@link QueryResult}
 */
export function schemaVisualisationToQueryResult(
  result: SchemaVisualisationResult
): QueryResult {
  return {
    nodes: result.nodes.map((node) => ({
      id: node.identity,
      types: node.labels,
    })),
    edges: result.relationships.map((edge) => ({
      id: edge.identity,
      from: edge.start,
      to: edge.end,
      type: edge.type,
    })),
  };
}
