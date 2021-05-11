/**
 * Limit of number of nodes and edges of an API Query
 */
export interface LimitQuery {
  limit?: {
    /**
     * limit number nodes to be queried
     */
    nodes?: number;

    /**
     * limit number edges to be queried
     */
    edges?: number;
  };
}
