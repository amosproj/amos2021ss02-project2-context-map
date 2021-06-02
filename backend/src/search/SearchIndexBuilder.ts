import MiniSearch from 'minisearch';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { neo4jReturnEdge, neo4jReturnNode } from '../config/commonFunctions';
import { Node, Edge } from '../shared/entities';
import { parseNeo4jEntityInfo } from '../schema/parseNeo4jEntityInfo';
import { SearchIndex } from './SearchIndex';
import { AsyncLazy } from '../shared/utils';
import { SearchIndexEntryRecorder } from './SearchIndexEntryRecorder';

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
    const entryRecorder = new SearchIndexEntryRecorder();

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
      entryRecorder.recordNode(node);
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
      entryRecorder.recordEdge(edge);
    }

    // Get all node types from the database
    const nodeTypeResults = await this.neo4jService.read(
      `CALL db.schema.nodeTypeProperties`
    );

    const nodeTypes = parseNeo4jEntityInfo(nodeTypeResults.records, 'node');

    // eslint-disable-next-line no-restricted-syntax
    for (const nodeType of nodeTypes) {
      entryRecorder.recordNodeType(nodeType);
    }

    // Get all edge types from the database
    const edgeTypeResults = await this.neo4jService.read(
      `CALL db.schema.relTypeProperties`
    );

    const edgeTypes = parseNeo4jEntityInfo(edgeTypeResults.records, 'rel');

    // eslint-disable-next-line no-restricted-syntax
    for (const edgeType of edgeTypes) {
      entryRecorder.recordEdgeType(edgeType);
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
    index.addAll(entryRecorder.recordedEntries);
    return index;
  }
}
