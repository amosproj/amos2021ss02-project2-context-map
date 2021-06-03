export default interface QueryBase {
  limits?: {
    nodes?: number;
    edges?: number;
  };

  /**
   * A boolean value that determines whether subsidiary nodes will be included in the query result.
   * If unspecified or false, edges that reference non-included nodes are removed from the query result.
   */
  includeSubsidiary?: boolean;
}
