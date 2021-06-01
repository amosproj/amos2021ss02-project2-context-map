import { FilterQuery, QueryResult } from '../shared/queries';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../shared/filter';

/**
 * Base type for filter services.
 */
export abstract class FilterServiceBase {
  /**
   * Asynchronously performs a query with the specified query parameters.
   * @param query The query parameters that specify the desired query result.
   * @returns A promise that represents the asynchronous operation. When evaluated, the promise result contains the query result.
   */
  public abstract query(query?: FilterQuery): Promise<QueryResult>;

  /**
   * Asynchronously gets a specialized model for the specified type of node that contains all information necessary to display a filter-line.
   * @param type The type of node.
   * @returns A promise that represents the asynchronous operation. When evaluated, the promise result contains the requested model.
   */
  public abstract getNodeTypeFilterModel(
    type: string
  ): Promise<NodeTypeFilterModel>;

  /**
   * Asynchronously gets a specialized model for the specified type of edge that contains all information necessary to display a filter-line.
   * @param type The type of edge.
   * @returns A promise that represents the asynchronous operation. When evaluated, the promise result contains the requested model.
   */
  public abstract getEdgeTypeFilterModel(
    type: string
  ): Promise<EdgeTypeFilterModel>;
}
