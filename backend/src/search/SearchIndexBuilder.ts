import MiniSearch from 'minisearch';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { neo4jReturnEdge, neo4jReturnNode } from '../config/commonFunctions';
import { Node, Edge } from '../shared/entities';
import { parseNeo4jEntityInfo } from '../schema/parseNeo4jEntityInfo';
import { EdgeType, EntityType, NodeType } from '../shared/schema';
import { SearchIndex } from './SearchIndex';
import { AsyncLazy } from '../shared/utils';
import { IndexEntry } from './IndexEntry';

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
    if (value.length > 1) {
      return flattenArray(
        <string[]>(
          value.map((entry) => convertToString(entry)).filter((entry) => entry)
        )
      );
    }

    return convertToString(value[0]);
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
 * Translated an edge to an index-entry and records it in an entries collection.
 * @param node The edge to translate.
 * @param entries The collection of index entries.
 * @returns The translated edge.
 */
function recordEdge(edge: Edge, entries: IndexEntry[]): void {
  // For an edge, we want to search in the if of the edge, in the name of the entity-type of edge
  // and in the values of all the properties.
  const entityIdEntry: IndexEntry = {
    entityType: 'edge',
    id: edge.id,
    types: [edge.type],
    to: edge.to,
    from: edge.from,
    indexKey: 'id',
    indexValue: edge.id.toString(),
  };

  entries.push(entityIdEntry);

  const entityTypeEntry: IndexEntry = {
    entityType: 'edge',
    id: edge.id,
    types: [edge.type],
    to: edge.to,
    from: edge.from,
    indexKey: 'type',
    indexValue: edge.type,
  };

  entries.push(entityTypeEntry);

  const keys = Object.keys(edge.properties);

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    const value = <unknown>edge.properties[key];
    const stringifiedValue = convertToString(value);

    if (stringifiedValue) {
      entries.push({
        entityType: 'edge',
        id: edge.id,
        types: [edge.type],
        to: edge.to,
        from: edge.from,
        indexKey: `properties.${key}`,
        indexValue: stringifiedValue,
      });
    }
  }
}

/**
 * Translated a node to an index-entry and records it in an entries collection.
 * @param node The node to translate.
 * @param entries The collection of index entries.
 * @returns The translated node.
 */
function recordNode(node: Node, entries: IndexEntry[]): void {
  // For a node, we want to search in the if of the node, in the name of the entity-type of node
  // and in the values of all the properties.
  const entityIdEntry: IndexEntry = {
    entityType: 'node',
    id: node.id,
    types: node.types,
    indexKey: 'id',
    indexValue: node.id.toString(),
  };

  entries.push(entityIdEntry);

  const entityTypeEntry: IndexEntry = {
    entityType: 'node',
    id: node.id,
    types: node.types,
    indexKey: 'type',
    indexValue: flattenArray(node.types),
  };

  entries.push(entityTypeEntry);

  const keys = Object.keys(node.properties);

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    const value = <unknown>node.properties[key];
    const stringifiedValue = convertToString(value);

    if (stringifiedValue) {
      entries.push({
        entityType: 'node',
        id: node.id,
        types: node.types,
        indexKey: `properties.${key}`,
        indexValue: stringifiedValue,
      });
    }
  }
}

/**
 * Translates an entity-type to an index-entry and records it in an entries collection.
 * @param entityType The entity-type to translates.
 * @param type The type of entity the translation affects. This is either a node-type or an edge-type.
 * @param entries The collection of index entries.
 * @returns The translated entity-type.
 */
function recordEntityType(
  entityType: EntityType,
  type: 'node-type' | 'edge-type',
  entries: IndexEntry[]
): void {
  // We store an entity type as index entry in the following way:
  // The id of the entry is the name of the type,
  // There is a single entry-property thats name is `property`and thats value is the concatenated names of
  // all properties the entity-type contains.
  // For example:
  // A node of type Person consists of the properties 'name', 'born', 'address'.
  // The index entry looks like:
  // { id: 'Person', indexValue: '[name, born, address]' }

  // For an entity-type, we want to search in the name of the entity-type
  // and in the name of the properties, so we have to insert two entries into the index.
  const entityTypeNameEntry = {
    entityType: type,
    id: entityType.name,
    indexKey: 'id',
    indexValue: entityType.name,
  };

  entries.push(entityTypeNameEntry);

  if (entityType.properties.length > 0) {
    const entityTypePropertiesEntry = {
      entityType: type,
      id: entityType.name,
      indexKey: 'properties.properties',
      indexValue: flattenArray(entityType.properties.map((prop) => prop.name)),
    };

    entries.push(entityTypePropertiesEntry);
  }
}

/**
 * Translates an edge-type to an index-entry and records it in an entries collection.
 * @param edgeType The edge-type to translate.
 * @param entries The collection of index entries.
 * @returns The translated edge-type.
 */
function recordEdgeType(edgeType: EdgeType, entries: IndexEntry[]): void {
  const nodeEntityEntry: IndexEntry = {
    entityType: 'edge-type',
    id: edgeType.name,
    indexKey: 'entity-type',
    indexValue: 'edge',
  };

  entries.push(nodeEntityEntry);

  recordEntityType(edgeType, 'edge-type', entries);
}

/**
 * Translates a node-type to an index-entry and records it in an entries collection.
 * @param nodeType The node-type to translate.
 * @param entries The collection of index entries.
 * @returns The translated node-type.
 */
function recordNodeType(nodeType: NodeType, entries: IndexEntry[]): void {
  const nodeEntityEntry: IndexEntry = {
    entityType: 'node-type',
    id: nodeType.name,
    indexKey: 'entity-type',
    indexValue: 'node',
  };

  entries.push(nodeEntityEntry);

  recordEntityType(nodeType, 'node-type', entries);
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
    const entries: IndexEntry[] = [];

    // TODO: For large databases it would be beneficial, if we read the entries in smaller batches,
    //       so we don't have to copy the entire dataset into memory (again).
    //       The problem here, is that we need the property names before adding the entries to the
    //       index. This can be done by executing an up-front query for the schema of the data,
    //       as is done in the SchemaService.

    // Get all nodes from the database
    const nodeResults = await this.neo4jService.read(
      `MATCH (n) RETURN ${neo4jReturnNode('n')}`
    );

    const nodes = nodeResults.records.map(
      (record) => record.toObject() as Node
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const node of nodes) {
      recordNode(node, entries);
    }

    // Get all edges from the database
    const edgeResults = await this.neo4jService.read(
      `
      MATCH (from)-[e]->(to) 
      RETURN ${neo4jReturnEdge('e', 'from', 'to')}
      ORDER BY id, from
      `
    );

    const edges = edgeResults.records.map(
      (record) => record.toObject() as Edge
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const edge of edges) {
      recordEdge(edge, entries);
    }

    // Get all node types from the database
    const nodeTypeResults = await this.neo4jService.read(
      `CALL db.schema.nodeTypeProperties`
    );

    const nodeTypes = parseNeo4jEntityInfo(nodeTypeResults.records, 'node');

    // eslint-disable-next-line no-restricted-syntax
    for (const nodeType of nodeTypes) {
      recordNodeType(nodeType, entries);
    }

    // Get all edge types from the database
    const edgeTypeResults = await this.neo4jService.read(
      `CALL db.schema.relTypeProperties`
    );

    const edgeTypes = parseNeo4jEntityInfo(edgeTypeResults.records, 'rel');

    // eslint-disable-next-line no-restricted-syntax
    for (const edgeType of edgeTypes) {
      recordEdgeType(edgeType, entries);
    }

    // Build the index
    const fields = ['indexValue'];
    const storeFields = [
      'entityType',
      'id',
      'types',
      'from',
      'to',
      'indexKey',
      'indexValue',
    ];

    const index = new MiniSearch({
      idField: 'id',
      fields,
      storeFields,
    });
    index.addAll(entries);
    return index;
  }
}
