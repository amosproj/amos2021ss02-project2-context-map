import { EdgeDescriptor } from '../entities/EdgeDescriptor';
import { NodeDescriptor } from '../entities/NodeDescriptor';

/**
 * Generic Result of an API Query
 */
export class QueryResult {
  nodes: NodeDescriptor[];
  edges: EdgeDescriptor[];
}
