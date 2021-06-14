import { NodeDescriptor } from '../entities/NodeDescriptor';

/**
 * NodeDescriptor with additional information about the node in context of a query result.
 */
export default interface QueryNodeResult extends NodeDescriptor {
  /**
   * A boolean that specifies whether the node is part of the result only to support edges that are part of the result that reference the node.
   */
  subsidiary?: boolean;

  /**
   * A boolean that specifies whether the node is virtual.
   * A virtual node is a node that is not part of the dataset but is a placeholder for a complete subgraph.
   * A virtual node's id is oblivious. It can be of any value and does not correspond to a true database entry.
   */
  virtual?: boolean;

  /**
   * A boolean that specified whether the node is part of the path that shall be highlighted.
   */
  isPath?: boolean;
}
