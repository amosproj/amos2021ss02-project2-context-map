import { EdgeDescriptor } from '../EdgeDescriptor';
import { NodeDescriptor } from '../NodeDescriptor';

/**
 * Generic Result of an API Query
 */
export interface QueryResult {
  /**
   * NodeDescriptors (array of node-ids) as result of the Query
   */
  nodes: NodeDescriptor[];

  /**
   * EdgeDescriptors (array of node-ids, from-ids and edge-ids) as result of the Query
   */
  edges: EdgeDescriptor[];
}
