import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import { ArgumentError } from '../shared/errors';

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

/**
 * Creates a {@link Path} instance from the specified values.
 * @param start The start-node of the path.
 * @param end The end-node of the path.
 * @param edges The ordered collection of edges that the path consists of.
 * @returns The created path.
 */
export function Path(
  start: NodeDescriptor,
  end: NodeDescriptor,
  edges: PathEdgeEntry[]
): Path {
  let lastNodeId = start.id;

  for (const edge of edges) {
    if (edge.from === lastNodeId) {
      lastNodeId = edge.to; // Edge in path direction
    } else if (edge.to === lastNodeId) {
      lastNodeId = edge.from; // Edge in reverse path direction
    } else {
      throw new ArgumentError('The arguments do not specify a valid path.');
    }
  }

  if (lastNodeId !== end.id) {
    throw new ArgumentError('The arguments do not specify a valid path.');
  }

  return { start, end, edges };
}
