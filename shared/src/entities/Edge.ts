import { EdgeDescriptor } from './EdgeDescriptor';
import { Property } from './Property';

/**
 * Represents an edge of a graph with additional information.
 */
export interface Edge extends EdgeDescriptor {
  /**
   * The unique name of the type of the edge.
   */
  type: string;
  properties: {
    [key: string]: Property;
  };
}
