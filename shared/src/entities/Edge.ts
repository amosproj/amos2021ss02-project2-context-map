import { EdgeDescriptor } from './EdgeDescriptor';
import { Property } from './Property';

/**
 * Represents an edge of a graph with additional information.
 */
export interface Edge extends EdgeDescriptor {
  /**
   * type-property of a neo4j-edge
   */
  type: string;
  properties: {
    [key: string]: Property;
  };
}
