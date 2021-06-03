import { EdgeDescriptor } from '../entities/EdgeDescriptor';
import QueryNodeResult from './QueryNodeResult';

/**
 * Generic Result of an API Query.
 * It is guaranteed that an instance contains all nodes descriptors that are
 * referenced in the edge descriptors via 'to' and 'from' attributes.
 */
export default interface QueryResult {
  /**
   * NodeDescriptors (array of node-ids) as result of the Query
   */
  nodes: QueryNodeResult[];

  /**
   * EdgeDescriptors (array of node-ids, from-ids and edge-ids) as result of the Query
   */
  edges: EdgeDescriptor[];
}
