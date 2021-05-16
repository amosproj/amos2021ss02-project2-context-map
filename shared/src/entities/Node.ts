import { Property } from './Property';
import { NodeDescriptor } from './NodeDescriptor';

/**
 * Represents a node of a graph with additional information.
 */
export interface Node extends NodeDescriptor {
  /**
   * The unique name of the types of the node.
   */
  types: string[];

  /**
   * properties-property of a node
   */
  properties: {
    [key: string]: Property;
  };
}
