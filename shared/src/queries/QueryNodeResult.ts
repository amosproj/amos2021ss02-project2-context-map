import { NodeDescriptor } from '../entities/NodeDescriptor';

/**
 * NodeDescriptor with additional information about the node in context of a query result.
 */
export default interface QueryNodeResult extends NodeDescriptor {
  /**
   * A boolean that specifies whether the node is part of the result only to support edges that are part of the result that reference the node.
   */
  subsidiary?: boolean;
}
