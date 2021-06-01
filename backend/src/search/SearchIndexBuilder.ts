import MiniSearch from 'minisearch';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { neo4jReturnEdge, neo4jReturnNode } from '../config/commonFunctions';
import { Node, Edge, Property } from '../shared/entities';
import { parseNeo4jEntityInfo } from '../schema/parseNeo4jEntityInfo';
import { EdgeType, EntityType, NodeType } from '../shared/schema';
import { SearchIndex } from './SearchIndex';
import { AsyncLazy } from '../shared/utils';
import { IndexEntry } from './IndexEntry';

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
export class SearchIndexBuilder {
  public constructor(private readonly neo4jService: Neo4jService) {}

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
