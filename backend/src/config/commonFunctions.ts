/* istanbul ignore next */
/**
 * Returns the string that returns our NodeDescriptor object
 * @param node Name of the variable in the query
 */
export function neo4jReturnNodeDescriptor(node: string): string {
  return `ID(${node}) as id`;
}

/* istanbul ignore next */
/**
 * Returns the string that returns our EdgeDescriptor object
 * @param edge Name of the edge in the query
 * @param from Name of the start-edge in the query
 * @param to Name of the end-edge in the query
 */
export function neo4jReturnEdgeDescriptor(
  edge: string,
  from: string,
  to: string
): string {
  return `ID(${edge}) as id, ID(${from}) as from, ID(${to}) as to`;
}

/* istanbul ignore next */
/**
 * Returns the string that returns our Node object
 * @param node Name of the variable in the query
 */
export function neo4jReturnNode(node: string): string {
  return `ID(${node}) as id, labels(${node}) as labels, properties(${node}) as properties`;
}

/* istanbul ignore next */
/**
 * Returns the string that returns our Edge object
 * @param edge Name of the edge in the query
 * @param from Name of the start-edge in the query
 * @param to Name of the end-edge in the query
 */
export function neo4jReturnEdge(
  edge: string,
  from: string,
  to: string
): string {
  return `ID(${edge}) as id, ID(${from}) as from, ID(${to}) as to, properties(${edge}) as properties, type(${edge}) as type`;
}
