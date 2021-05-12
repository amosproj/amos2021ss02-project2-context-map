import { Property } from './Property';
import { NodeDescriptor } from './NodeDescriptor';

/**
 * Represents a node of a graph with additional information.
 */
export interface Node extends NodeDescriptor {
  /**
   * labels-property of a node
   */
  labels: string[];

  /**
   * properties-property of a node
   */
  properties: {
    [key: string]: Property;
  };
}
