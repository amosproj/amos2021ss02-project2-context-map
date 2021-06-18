import { EdgeDescriptor } from '../entities/EdgeDescriptor';

/**
 * EdgeDescriptor with additional information about the edge in context of a query result.
 */
export interface QueryEdgeResult extends EdgeDescriptor {
  /**
   * A boolean that specifies whether the edge is part of the result only to support edges that are part of the result that reference the edge.
   */
  subsidiary?: boolean;

  /**
   * A boolean that specifies whether the edge is virtual.
   * A virtual edge is an edge that is not part of the dataset but is a placeholder for a complete subgraph.
   * A virtual edge's id is oblivious. It can be of any value and does not correspond to a true database entry.
   */
  virtual?: boolean;

  /**
   * A boolean that specified whether the edge is part of the path that shall be highlighted.
   */
  isPath?: boolean;

  /**
   * Specifies whether this node was searched for.
   */
  searched?: boolean;
}
