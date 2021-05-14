import { EntityType } from '../shared/schema/EntityType';
import { EntityTypeProperty } from '../shared/schema/EntityTypeProperty';
import {
  neo4jReturnEdgeDescriptor,
  neo4jReturnNodeDescriptor,
} from '../config/commonFunctions';

/**
 * Returns a string to find all nodes/edges that have a properties with a value
 * that contains $filter (case-insensitive).
 *
 * The query will never return any entities that have no attributes.
 *
 * @param schema DB-Schema
 * @param target What the query should return
 *
 * @example
 * ```ts
 * const cypher = createTextSearchCypher(scheme, 'nodes')
 * neo4jService.read(cypher, { filter: 'Hello World' });
 * ```
 */
export function createTextSearchCypher(
  schema: EntityType[],
  target: 'nodes' | 'edges'
): string {
  let cypher = 'MATCH ';

  // set up target related stuff
  let entities: string;
  let returnStatement: string;
  switch (target) {
    case 'nodes':
      entities = '(n) ';
      returnStatement = `RETURN ${neo4jReturnNodeDescriptor('n')}`;
      break;
    case 'edges':
      entities = '(from)-[n]->(to) ';
      returnStatement = `RETURN ${neo4jReturnEdgeDescriptor(
        'n',
        'from',
        'to'
      )}`;
      break;
    /* istanbul ignore next */
    default:
      throw Error('Unknown target');
  }

  cypher += entities;
  cypher += 'WHERE ';

  const propertyOfType = (types: string[], prop: EntityTypeProperty) =>
    types.some((type) => prop.types.includes(type));

  // Add WHERE cases
  schema
    // get all attributes as list
    .reduce((properties, edge) => {
      properties.push(...edge.properties);
      return properties;
    }, [] as EntityTypeProperty[])
    // only use these attributes that can be converted to string
    .forEach((prop) => {
      if (propertyOfType(['Long', 'String'], prop)) {
        // attr as string contains $filter (case-insensitive)?
        cypher += `toString(n.${prop.name}) =~ "(?i).*" + $filter + ".*" OR `;
      }
      if (propertyOfType(['StringArray'], prop)) {
        // like before but with arrays
        cypher += `reduce(found = false, prop in n.${prop.name} | found OR toString(prop) =~ "(?i).*" + $filter + ".*" ) OR `;
      }
    });

  // cypher ends with 'OR ' or with 'WHERE ' if no attributes found
  cypher += 'False ';
  cypher += returnStatement;

  return cypher;
}
