import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';

/**
 * An edge entry in a graph path.
 */
export interface PathEdgeEntry extends EdgeDescriptor {
  /**
   * The cost of the edge.
   */
  cost: number;
}

/**
 * Describes a path through a graph of nodes.
 */
export interface Path {
  /**
   * The start-node of the path. May be equal to the end-node.
   */
  start: NodeDescriptor;

  /**
   * The end-node of the path. May be equal to the start-node.
   */
  end: NodeDescriptor;

  /**
   * The ordered collection of edges that the path consists of.
   * The array contains one less entry than the nodes array.
   * The array must not contain edges that reference nodes that are not included in the nodes array.
   */
  edges: PathEdgeEntry[];
}
