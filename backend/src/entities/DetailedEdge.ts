/**
 * Represents an edge / a relations of a graph with additional information.
 */
import { Edge } from './Edge';

export interface DetailedEdge extends Edge {
  type: string;
  properties: {
    // TODO Find out which types are possible
    [key: string]: string | number | unknown;
  };
}
