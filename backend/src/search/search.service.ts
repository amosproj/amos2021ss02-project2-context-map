import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import MiniSearch from 'minisearch';
import { SearchResult } from '../shared/search';
import { AsyncLazy } from '../shared/utils';
import {
  Node,
  Edge,
  Property,
  NodeDescriptor,
  EdgeDescriptor,
} from '../shared/entities';
import { parseNeo4jEntityInfo } from '../schema/parseNeo4jEntityInfo';
import {
  EdgeType,
  NodeType,
  EntityType,
  NodeTypeDescriptor,
  EdgeTypeDescriptor,
} from '../shared/schema';
import { SearchServiceBase } from './search.service.base';
import { neo4jReturnEdge, neo4jReturnNode } from '../config/commonFunctions';

interface RestoredIndexEntry {
  /**
   * Contains the type of index entry.
   */
  entityType: 'node' | 'edge' | 'node-type' | 'edge-type';

  /**
   * Contains the id of the entity or the name of the entity type.
   */
  id: number | string;

  /**
   * Contains the id of the from node of the edge, if {@link entityType} is 'edge', {@code undefined} otherwise.
   */
  from?: number;

  /**
   * Contains the id of the to node of the edge, if {@link entityType} is 'edge', {@code undefined} otherwise.
   */
  to?: number;
}

interface IndexEntry extends RestoredIndexEntry {
  /**
   * Contains the type of entity, that is the type of edge or the combined types of the node if the entry represents an entity,
   * or the name of the entity-type if the entry represents an entity-type.
   */
  type?: string;

  /**
   * Contains the properties of the entity.
   */
  properties: {
    [key: string]: string | undefined;
  };
}

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

function flattenArray(array: string[]): string {
  return `[${array.join(', ')}]`;
}

function convertProperties(properties: {
  [key: string]: Property;
}): {
  [key: string]: string | undefined;
} {
  const result: { [key: string]: string | undefined } = {};
  const keys = Object.keys(properties);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = <any>properties[key];

    if (Array.isArray(value)) {
      let combinedValue = '[';
      for (let j = 0; j < value.length; j += 1) {
        const arrayValue = value[j];

        if (typeof arrayValue === 'string') {
          if (j > 0) {
            combinedValue += ', ';
          }
          combinedValue += arrayValue;
        } else if (typeof arrayValue.toString === 'function') {
          if (j > 0) {
            combinedValue += ', ';
          }
          combinedValue += arrayValue.toString();
        }
      }

      combinedValue += ']';
      result[key] = combinedValue;
    } else if (typeof value === 'string') {
      result[key] = value;
    } else if (typeof value.toString === 'function') {
      result[key] = value.toString();
    }
  }

  return result;
}

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

function convertNode(node: Node): IndexEntry {
  return {
    entityType: 'node',
    id: node.id,
    type: flattenArray(node.types),
    properties: convertProperties(node.properties),
  };
}

function convertEntityType(
  entityType: EntityType,
  type: 'node-type' | 'edge-type'
): IndexEntry {
  return {
    entityType: type,
    id: entityType.name,
    type: entityType.name,
    properties: {
      properties: flattenArray(entityType.properties.map((prop) => prop.name)),
    },
  };
}

function convertEdgeType(edgeType: EdgeType): IndexEntry {
  return convertEntityType(edgeType, 'edge-type');
}

function convertNodeType(nodeType: NodeType): IndexEntry {
  return convertEntityType(nodeType, 'node-type');
}

@Injectable()
export class SearchService implements SearchServiceBase {
  private readonly index: AsyncLazy<MiniSearch>;

  constructor(private readonly neo4jService: Neo4jService) {
    this.index = new AsyncLazy<MiniSearch>(this.buildIndex.bind(this));
  }

  private async buildIndex(): Promise<MiniSearch> {
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

  /**
   * Searches through all entities and entity types and returns those, that
   * match the searchString. It only returns those value with the prefix of
   * searchStrings.
   * Values with n spaces are considered as n+1 single values.
   *
   * @example
   * 'Keanu' returns 'Keanu Reeves'
   * @example
   * 'kean' returns 'Keanu Reeves'
   * @example
   * 'reev' returns 'Keanu Reeves'
   * @example
   * 'name' returns 'Keanu Reeves' (since this node has the attribute 'name')
   */
  public async search(searchString: string): Promise<SearchResult> {
    const index = await this.index.value;

    // TODO: We could add additional functionality, like special syntax to search in a specified field.
    //       This would allow search-strings, like 'ghostbusters entity:node type:!movie genre:~mystery'
    //       Where
    //        ! means 'exact match' and
    //        ~ means 'does not include'
    const searchResults = index
      .search(searchString, { prefix: true })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((result) => (result as any) as RestoredIndexEntry);

    const nodes: NodeDescriptor[] = [];
    const edges: EdgeDescriptor[] = [];
    const nodeTypes: NodeTypeDescriptor[] = [];
    const edgeTypes: EdgeTypeDescriptor[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const searchResult of searchResults) {
      if (
        searchResult.entityType === 'node' &&
        typeof searchResult.id === 'number'
      ) {
        nodes.push({ id: searchResult.id });
      } else if (
        searchResult.entityType === 'edge' &&
        typeof searchResult.id === 'number' &&
        typeof searchResult.from === 'number' &&
        typeof searchResult.to === 'number'
      ) {
        edges.push({
          id: searchResult.id,
          from: searchResult.from,
          to: searchResult.to,
        });
      } else if (
        searchResult.entityType === 'node-type' &&
        typeof searchResult.id === 'string'
      ) {
        nodeTypes.push({
          name: searchResult.id,
        });
      } else if (
        searchResult.entityType === 'edge-type' &&
        typeof searchResult.id === 'string'
      ) {
        edgeTypes.push({
          name: searchResult.id,
        });
      }
    }

    return { nodes, edges, nodeTypes, edgeTypes };
  }

  public async getAutoSuggestions(searchString: string): Promise<string[]> {
    const index = await this.index.value;

    // TODO: We could add additional functionality, like special syntax to search in a specified field.
    //       This would allow search-strings, like 'ghostbusters entity:node type:!movie genre:~mystery'
    //       Where
    //        ! means 'exact match' and
    //        ~ means 'does not include'
    return index
      .autoSuggest(searchString)
      .map((suggestion) => suggestion.suggestion);
  }
}
