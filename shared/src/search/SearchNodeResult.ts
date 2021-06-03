import { NodeDescriptor } from '../entities/NodeDescriptor';

/**
 * Represents a search node result.
 */
export interface SearchNodeResult extends NodeDescriptor {
  /**
   * The properties that contain the search string.
   */
  properties?: {
    [key: string]: string | undefined;
  };

  /**
   * The unique name of the types of the node.
   */
  types: string[];
}
