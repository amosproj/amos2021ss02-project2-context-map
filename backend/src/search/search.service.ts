import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import MiniSearch from 'minisearch';
import { QueryResult } from '../shared/queries/QueryResult';
import AsyncLazy from '../utils/AsyncLazy';
import { Node } from '../shared/entities/Node';
import { Edge } from '../shared/entities/Edge';
import { Property } from '../shared/entities/Property';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';

interface RestoredIndexEntry {
  /**
   * Contains the type of index entry.
   */
  entityType: 'node' | 'edge';

  /**
   * Contains the id of the entry.
   */
  id: number;

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
   * Contains the type of entity, that is the type of node or the combined labels of the node.
   */
  type: string;

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

function convertLabels(labels: string[]): string {
  let result = '[';
  for (let j = 0; j < labels.length; j += 1) {
    const label = labels[j];

    if (j > 0) {
      result += ', ';
    }
    result += label;
  }

  result += ']';
  return result;
}

function convertProperties(properties: {
  [key: string]: Property;
}): { [key: string]: string | undefined } {
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
    type: convertLabels(node.labels),
    properties: convertProperties(node.properties),
  };
}

@Injectable()
export class SearchService {
  private readonly index: AsyncLazy<MiniSearch>;

  constructor(private readonly neo4jService: Neo4jService) {
    this.index = new AsyncLazy<MiniSearch>(this.buildIndex.bind(this));
  }

  private async buildIndex(): Promise<MiniSearch> {
    // Get all nodes from the database
    const nodeResults = await this.neo4jService.read(
      'MATCH (n) RETURN ID(n) as id, labels(n) as labels, properties(n) as properties'
    );

    const nodeEntries = nodeResults.records.map((record) =>
      convertNode(record.toObject() as Node)
    );

    // Get all edges from the database
    const edgeResults = await this.neo4jService.read(
      `
      MATCH (from)-[e]->(to) 
      RETURN ID(e) as id, ID(from) as from, ID(to) as to, properties(e) as properties, type(e) as type
      ORDER BY id, from
      `
    );

    const edgeEntries = edgeResults.records.map((record) =>
      convertEdge(record.toObject() as Edge)
    );

    // Build the index
    const fields = ['id', 'type'];
    const storeFields = ['entityType', 'id', 'from', 'to'];

    // Process all entries: We need to now which properties we have
    const properties = new Set<string>();

    recordPropertyKeys(nodeEntries, properties);
    recordPropertyKeys(edgeEntries, properties);

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
    return index;
  }

  public async search(searchString: string): Promise<QueryResult> {
    const index = await this.index.value;

    // TODO: We could add additional functionality, like special syntax to search in a specified field.
    //       This would allow search-strings, like 'ghostbusters entity:node type:!movie genre:~mystery'
    //       Where
    //        ! means 'exact match' and
    //        ~ means 'does not include'
    const searchResults = index
      .search(searchString)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((result) => (result as any) as RestoredIndexEntry);

    const nodes: NodeDescriptor[] = [];
    const edges: EdgeDescriptor[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const searchResult of searchResults) {
      if (searchResult.entityType === 'node') {
        nodes.push({ id: searchResult.id });
      } else if (
        searchResult.entityType === 'edge' &&
        searchResult.from &&
        searchResult.to
      ) {
        edges.push({
          id: searchResult.id,
          from: searchResult.from,
          to: searchResult.to,
        });
      }
    }

    return { nodes, edges };
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
