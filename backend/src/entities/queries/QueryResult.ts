import { EdgeDescriptor } from '../EdgeDescriptor';
import { NodeDescriptor } from '../NodeDescriptor';

/**
 * Generic Result of an API Query
 */
export class QueryResult {
  nodes: NodeDescriptor[];
  edges: EdgeDescriptor[];
}
