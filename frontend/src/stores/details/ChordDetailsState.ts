/**
 * Describes the state of the chord entity details to show.
 */
export interface ChordDetailsState {
  /**
   * Node type to show relations for.
   */
  type: string | null;

  /**
   * A 2D array containing all edges of the graph
   */
  matrix: number[][] | null;

  /**
   * index of the node type in the matrix.
   */
  index: number | null;
}
