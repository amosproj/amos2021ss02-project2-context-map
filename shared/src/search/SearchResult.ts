import { EdgeTypeDescriptor } from '../schema/EdgeTypeDescriptor';
import { NodeTypeDescriptor } from '../schema/NodeTypeDescriptor';
import { SearchEdgeResult } from './SearchEdgeResult';
import { SearchNodeResult } from './SearchNodeResult';

/**
 * Represents the result of a search request.
 * It is NOT guaranteed that an instance contains all nodes descriptors that are
 * referenced in the edge descriptors via 'to' and 'from' attributes.
 */
export interface SearchResult {
  /**
   * Search node results (array of node-ids) as result of the search operation
   */
  nodes: SearchNodeResult[];

  /**
   * Search edge results (array of node-ids, from-ids and edge-ids) as result of the search operation
   */
  edges: SearchEdgeResult[];

  /**
   * NodeTypeDescriptor (array of node type names) as result of the search operation
   */
  nodeTypes: NodeTypeDescriptor[];

  /**
   * EdgeTypeDescriptor (array of edge type names) as result of the search operation
   */
  edgeTypes: EdgeTypeDescriptor[];
}
