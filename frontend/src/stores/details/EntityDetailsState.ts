/**
 * Describes the state of the entity details to show. There is always only node or edge present.
 */
export interface EntityDetailsState {
  /**
   * The id of the node that the details shall be shown for.
   */
  node: number | null;

  /**
   * The id of the edge that the details shall be shown for.
   */
  edge: number | null;
}
