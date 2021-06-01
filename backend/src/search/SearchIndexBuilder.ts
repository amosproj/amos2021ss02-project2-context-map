import MiniSearch from 'minisearch';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { neo4jReturnEdge, neo4jReturnNode } from '../config/commonFunctions';
import { Node, Edge, Property } from '../shared/entities';
import { parseNeo4jEntityInfo } from '../schema/parseNeo4jEntityInfo';
import { EdgeType, EntityType, NodeType } from '../shared/schema';
import { SearchIndex } from './SearchIndex';
import { AsyncLazy } from '../shared/utils';
import { IndexEntry, IndexEntryProperties } from './IndexEntry';

/**
 * Records all property keys of the specified index entries to the specified set of property keys.
 * @param entries The index entries thats properties keys shall be recorded.
 * @param properties The resulting set of property keys.
 */
function recordPropertyKeys(
  entries: IndexEntry[],
  properties: Set<string>
): void {
  for (let i = 0; i < entries.length; i += 1) {
    const propertyKeys = Object.keys(entries[i].properties);

    for (let j = 0; j < propertyKeys.length; j += 1) {
      properties.add(propertyKeys[j]);
    }
  }
}

/**
 * Flattens the specified string array.
 */
function flattenArray(array: string[]): string {
  return `[${array.join(', ')}]`;
}

/**
 * Converts the specified value to string or return null if the value cannot be converted.
 * @param value The value to stringify.
 * @returns The stringified version of the value, or null of the value cannot be converted.
 */
function convertToString(value: unknown): string | null {
  // If the value is a string, we are done.
  if (typeof value === 'string') {
    return value;
  }

  // If the value is an array, convert each element and combine them via flattenArray.
  if (Array.isArray(value)) {
    return flattenArray(
      <string[]>(
        value.map((entry) => convertToString(entry)).filter((entry) => entry)
      )
    );
  }

  // Try to invoke a 'toString()' function, that may be present.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (<any>value).toString === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (<any>value).toString();

    if (typeof result === 'string') {
      return result;
    }
  }

  // The value cannot be stringified.
  return null;
}

/**
 * Converts the properties of an entity, that is of a node or an edge.
 * @param properties The object that contains the properties.
 * @returns The translated properties.
 */
function convertProperties(properties: {
  [key: string]: Property;
}): IndexEntryProperties {
  const result: IndexEntryProperties = {};
  const keys = Object.keys(properties);

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    const value = <unknown>properties[key];
    const stringifiedValue = convertToString(value);

    if (stringifiedValue) {
      result[key] = stringifiedValue;
    }
  }

  return result;
}

/**
 * Translated an edge to an index-entry.
 * @param node The edge to translate.
 * @returns The translated edge.
 */
function convertEdge(edge: Edge): IndexEntry {
  return {
    entityType: 'edge',
    id: edge.id,
    from: edge.from,
    to: edge.to,
    type: edge.type,
    properties: convertProperties(edge.properties),
  };
}

/**
 * Translated a node to an index-entry.
 * @param node The node to translate.
 * @returns The translated node.
 */
function convertNode(node: Node): IndexEntry {
  return {
    entityType: 'node',
    id: node.id,
    type: flattenArray(node.types),
    properties: convertProperties(node.properties),
  };
}

/**
 * Translated an entity type, that is a node-type or an edge-type to an index-entry.
 * @param entityType The entity-type to translates.
 * @param type The type of entity the translation affects. This is either a node-type or an edge-type.
 * @returns The translated entity-type.
 */
function convertEntityType(
  entityType: EntityType,
  type: 'node-type' | 'edge-type'
): IndexEntry {
  // We store an entity type as index entry in the following way:
  // The id of the entry is the name of the type,
  // There is a single entry-property thats name is `property`and thats value is the concatenated names of
  // all properties the entity-type contains.
  // For example:
  // A node of type Person consists of the properties 'name', 'born', 'address'.
  // The index entry looks like:
  // { id: 'Person', properties: { properties: ['name', 'born', 'address'] } }

  return {
    entityType: type,
    id: entityType.name,
    type: entityType.name,
    properties: {
      properties: flattenArray(entityType.properties.map((prop) => prop.name)),
    },
  };
}

/**
 * Converts an edge-type to an index-entry.
 * @param edgeType The edge-type to translate.
 * @returns The translated edge-type.
 */
function convertEdgeType(edgeType: EdgeType): IndexEntry {
  return convertEntityType(edgeType, 'edge-type');
}

/**
 * Translated a node-type to an index-entry.
 * @param nodeType The node-type to translate.
 * @returns The translated node-type.
 */
function convertNodeType(nodeType: NodeType): IndexEntry {
  return convertEntityType(nodeType, 'node-type');
}

/**
 * A search index builder that can be used to build a search index from a complete dataset.
 */
@Injectable()
export class SearchIndexBuilder {
  public constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Builds a search index for the dataset in the database.
   * @returns The constructed search index.
   */
  public buildIndex(): SearchIndex {
    return new SearchIndex(new AsyncLazy(() => this.buildIndexCore()));
  }

  private async buildIndexCore(): Promise<MiniSearch> {
    // TODO: For large databases it would be beneficial, if we read the entries in smaller batches,
    //       so we don't have to copy the entire dataset into memory (again).
    //       The problem here, is that we need the property names before adding the entries to the
    //       index. This can be done by executing an up-front query for the schema of the data,
    //       as is done in the SchemaService.

    // Get all nodes from the database
    const nodeResults = await this.neo4jService.read(
      `MATCH (n) RETURN ${neo4jReturnNode('n')}`
    );

    const nodeEntries = nodeResults.records.map((record) =>
      convertNode(record.toObject() as Node)
    );

    // Get all edges from the database
    const edgeResults = await this.neo4jService.read(
      `
      MATCH (from)-[e]->(to) 
      RETURN ${neo4jReturnEdge('e', 'from', 'to')}
      ORDER BY id, from
      `
    );

    const edgeEntries = edgeResults.records.map((record) =>
      convertEdge(record.toObject() as Edge)
    );

    // Get all node types from the database
    const nodeTypeResults = await this.neo4jService.read(
      `CALL db.schema.nodeTypeProperties`
    );

    const nodeTypeEntries = parseNeo4jEntityInfo(
      nodeTypeResults.records,
      'node'
    ).map((record) => convertNodeType(record));

    // Get all edge types from the database
    const edgeTypeResults = await this.neo4jService.read(
      `CALL db.schema.relTypeProperties`
    );

    const edgeTypeEntries = parseNeo4jEntityInfo(
      edgeTypeResults.records,
      'rel'
    ).map((record) => convertEdgeType(record));

    // Build the index
    const fields = ['entityType', 'type'];
    const storeFields = ['entityType', 'id', 'from', 'to'];

    // Process all entries: We need to now which properties we have
    const properties = new Set<string>();

    recordPropertyKeys(nodeEntries, properties);
    recordPropertyKeys(edgeEntries, properties);
    recordPropertyKeys(nodeTypeEntries, properties);
    recordPropertyKeys(edgeTypeEntries, properties);

    // eslint-disable-next-line no-restricted-syntax
    for (const property of properties) {
      fields.push(`properties.${property}`);
    }

    const index = new MiniSearch({
      idField: 'id',
      fields,
      storeFields,
      // eslint-disable-next-line arrow-body-style
      extractField: (document, fieldName) => {
        // Access nested fields
        return fieldName
          .split('.')
          .reduce((doc, key) => doc && doc[key], document);
      },
    });
    index.addAll(nodeEntries);
    index.addAll(edgeEntries);
    index.addAll(nodeTypeEntries);
    index.addAll(edgeTypeEntries);
    return index;
  }
}
