import { EdgeDescriptor } from '../EdgeDescriptor';
import { NodeDescriptor } from '../NodeDescriptor';

/**
 * Generic Result of an API Query
 */
export interface QueryResult {
  nodes: NodeDescriptor[];
  edges: EdgeDescriptor[];
}
