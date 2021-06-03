import { FilterQuery, QueryResult } from '../shared/queries';
import { Path } from './Path';

export interface ShortestPathQuery extends FilterQuery {
  startNode: number;
  endNode: number;
  ignoreEdgeDirections?: boolean;
}

/**
 * The base type for shorted-path services.
 */
export abstract class ShortestPathServiceBase {
  /**
   * Finds the shortest path between two nodes considering the entire data-set.
   * @param startNode The id of the start node.
   * @param endNode The id of the end node.
   * @returns The shortest path between the specified nodes or null if the nodes are part of separated subgraphs.
   */
  public abstract findShortestPath(
    startNode: number,
    endNode: number,
    ignoreEdgeDirections?: boolean
  ): Promise<Path | null>;

  public abstract executeQuery(query: ShortestPathQuery): Promise<QueryResult>;
}
