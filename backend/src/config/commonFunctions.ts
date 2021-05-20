/*
This file contains functions that are shared across the app
 */

/* istanbul ignore next */
/**
 * Returns the string that returns our NodeDescriptor object
 *
 * **Warning**: Must not be used with arguments that stem from user generated
 * input to avoid database injection.
 *
 * @param node Name of the variable in the query
 *
 * @example
 *  query = `MATCH (n) WHERE [...] RETURN ${neo4jReturnNodeDescriptor('n')}`; // variable is called n
 * @example
 *  query = `MATCH (a)-->(b) WHERE [...] RETURN ${neo4jReturnNodeDescriptor('b')}`; // cypher variables are called a and b
 */
export function neo4jReturnNodeDescriptor(node: string): string {
  return `ID(${node}) as id`;
}

/* istanbul ignore next */
/**
 * Returns the string that returns our EdgeDescriptor object
 *
 * **Warning**: Must not be used with arguments that stem from user generated
 * input to avoid database injection.
 *
 * @param edge Name of the edge in the query
 * @param from Name of the start-edge in the query
 * @param to Name of the end-edge in the query
 *
 * @example
 *  query = `MATCH ()-[e]-() WHERE [...] RETURN ${neo4jReturnEdgeDescriptor('e')}`; // variable is called e
 * @example
 *  query = `MATCH (a)-[b]->(c) WHERE [...] RETURN ${neo4jReturnEdgeDescriptor('b', 'a', 'c')}`; // cypher variables are called a, b and c
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
 *
 * **Warning**: Must not be used with arguments that stem from user generated
 * input to avoid database injection.
 *
 * @param node Name of the variable in the query
 *
 * @example
 *  query = `MATCH (n) WHERE [...] RETURN ${neo4jReturnNode('n')}`; // variable is called n
 * @example
 *  query = `MATCH (a)-->(b) WHERE [...] RETURN ${neo4jReturnNode('b')}`; // cypher variables are called a and b
 */
export function neo4jReturnNode(node: string): string {
  return `ID(${node}) as id, labels(${node}) as types, properties(${node}) as properties`;
}

/* istanbul ignore next */
/**
 * Returns the string that returns our Edge object
 *
 * **Warning**: Must not be used with arguments that stem from user generated
 * input to avoid database injection.
 *
 * @param edge Name of the edge in the query
 * @param from Name of the start-edge in the query
 * @param to Name of the end-edge in the query
 *
 * @example
 *  query = `MATCH ()-[e]-() WHERE [...] RETURN ${neo4jReturnEdge('e')}`; // variable is called e
 * @example
 *  query = `MATCH (a)-[b]->(c) WHERE [...] RETURN ${neo4jReturnEdge('b', 'a', 'c')}`; // cypher variables are called a, b and c
 */
export function neo4jReturnEdge(
  edge: string,
  from: string,
  to: string
): string {
  return `ID(${edge}) as id, ID(${from}) as from, ID(${to}) as to, properties(${edge}) as properties, type(${edge}) as type`;
}
