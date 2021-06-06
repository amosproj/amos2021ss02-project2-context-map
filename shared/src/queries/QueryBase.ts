/**
 * A base type for query objects.
 */
export default interface QueryBase {
  /**
   * A limits object that specifies the number maximum of nodes and edges to include in the query result.
   */
  limits?: {
    /**
     * The maximum number of nodes to include in the query result.
     * If a value of 0 is specified, the query result does not include any nodes.
     * If the value is unspecified, the number of nodes is unlimited.
     */
    nodes?: number;

    /**
     * The maximum number of edges to include in the query result.
     * If a value of 0 is specified, the query result does not include any edges.
     * If the value is unspecified, the number of edges is unlimited.
     */
    edges?: number;
  };

  /**
   * A boolean value that determines whether subsidiary nodes will be included in the query result.
   * If unspecified or false, edges that reference non-included nodes are removed from the query result.
   */
  includeSubsidiary?: boolean;
}
