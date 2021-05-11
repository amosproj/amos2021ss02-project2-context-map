import { Property } from './Property';
import { NodeDescriptor } from './NodeDescriptor';

/**
 * Represents a node of a graph with additional information.
 */
export interface Node extends NodeDescriptor {
  id: number;
  labels: string[];
  properties: {
    [key: string]: Property;
  };
}
