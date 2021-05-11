/**
 * Describes an simple edge of a graph.
 */
export interface EdgeDescriptor {
  /**
   * ID of the edge
   */
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
