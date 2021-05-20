import { Edge } from '../entities/Edge';
import { Node } from '../entities/Node';
import { NodeType } from '../schema/NodeType';
import { EdgeType } from '../schema/EdgeType';

/**
 * Represents the result of a search request.
 * It is NOT guaranteed that an instance contains all nodes descriptors that are
 * referenced in the edge descriptors via 'to' and 'from' attributes.
 */
export interface ExpandedSearchResult {
  /**
   * Node (array of node-ids) as result of the search operation
   */
  nodes: Node[];

  /**
   * Edge (array of node-ids, from-ids and edge-ids) as result of the search operation
   */
  edges: Edge[];

  /**
   * NodeType (array of node type names) as result of the search operation
   */
  nodeTypes: NodeType[];

  /**
   * EdgeType (array of edge type names) as result of the search operation
   */
  edgeTypes: EdgeType[];
}
