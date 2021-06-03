import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';

/**
 * Describes a path through a graph of nodes.
 */
export interface Path {
  /**
   * The ordered collection of nodes the path consists of.
   * The first node is the start node, the last node is the end node.
   * The array must contain at least two entries.
   */
  nodes: NodeDescriptor[];

  /**
   * The ordered collection of edges that the path consists of.
   * The array contains one less entry than the nodes array.
   * The array must not contain edges that reference nodes that are not included in the nodes array.
   */
  edges: EdgeDescriptor[];
}
