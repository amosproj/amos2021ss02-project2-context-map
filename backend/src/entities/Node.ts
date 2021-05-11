import { Property } from './Property';
import { NodeDescriptor } from './NodeDescriptor';

/**
 * Represents a node of a graph with additional information.
 */
export interface Node extends NodeDescriptor {
  /**
   * labels-property of a neo4j-node
   */
  labels: string[];

  /**
   * properties-property of a neo4j-node
   */
  properties: {
    [key: string]: Property;
  };
}
