
/**
 * Result of the count entities query.
 */
export default interface CountQueryResult {
  /**
   * Number of nodes in the graph
   */
  nodes: number;

  /**
   * Number of edges in the graph
   */
  edges: number;
}
