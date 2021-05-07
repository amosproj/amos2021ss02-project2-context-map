/**
 * Represents an edge / a relations of a graph.
 */
export interface Edge {
  id: number;
  /**
   * ID of the start node
   */
  from: number;
  /**
   * ID of the end node
   */
  to: number;
}
