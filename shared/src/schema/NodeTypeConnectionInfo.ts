/**
 * Describes information about the connections between two node types.
 */
export interface NodeTypeConnectionInfo {
  /**
   * Node type
   */
  from: string,
  /**
   * Node type
   */
  to: string,
  /**
   * Number of direct and directed connections between {@link from} and {@link to}.
   */
  numConnections: number,
}
