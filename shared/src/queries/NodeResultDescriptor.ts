import { NodeDescriptor } from '../entities/NodeDescriptor';

export default interface NodeResultDescriptor extends NodeDescriptor {
  /**
   * A boolean that specifies whether the node is part of the result only to support edges that are part of the result that reference the node.
   */
  subsidiary?: boolean;
}
