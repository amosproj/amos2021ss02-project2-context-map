import { Path } from './Path';
import { QueryResult, ShortestPathQuery } from '../shared/queries';

/**
 * The base type for shorted-path services.
 */
export abstract class ShortestPathServiceBase {
  /**
   * Finds the shortest {@link Path} between two nodes considering the entire data-set.
   * @param startNode The id of the start node.
   * @param endNode The id of the end node.
   * @param ignoreEdgeDirections A boolean value indicating whether edge directions shall be ignored,
   * @returns The shortest {@link Path} between the specified nodes or null if the nodes are part of separated subgraphs.
   */
  public abstract findShortestPath(
    startNode: number,
    endNode: number,
    ignoreEdgeDirections?: boolean
  ): Promise<Path | null>;

  /**
   * @param query Executes a {@link ShortestPathQuery} and returns the query result.
   * @returns The query result of executing the query.
   */
  public abstract executeQuery(query: ShortestPathQuery): Promise<QueryResult>;
}
