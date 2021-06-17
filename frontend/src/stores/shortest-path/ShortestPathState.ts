/**
 * Describes the setting of a shortest path selection.
 */
export interface ShortestPathState {
  /**
   * The id of the start-node or null.
   */
  startNode: number | null;
  /**
   * The id of the end-node or null.
   */
  endNode: number | null;
  /**
   * A boolean value indicating whether edge directions shall be ignored.
   */
  ignoreEdgeDirections: boolean;
}
