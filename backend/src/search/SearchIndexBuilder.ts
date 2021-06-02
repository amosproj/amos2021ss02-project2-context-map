import MiniSearch from 'minisearch';
import { Injectable } from '@nestjs/common';
import { SearchIndex } from './SearchIndex';
import { AsyncLazy } from '../shared/utils';
import { SearchIndexEntryRecorder } from './SearchIndexEntryRecorder';
import { SchemaService } from '../schema/schema.service';
import { AppService } from '../app.service';

/**
 * A search index builder that can be used to build a search index from a complete dataset.
 */
@Injectable()
export class SearchIndexBuilder {
  public constructor(
    private readonly queryService: AppService,
    private readonly schemaService: SchemaService
  ) {}

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
    const nodes = await this.queryService.getNodes();

    for (const node of nodes) {
      entryRecorder.recordNode(node);
    }

    // Get all edges from the database
    const edges = await this.queryService.getEdgesById();

    for (const edge of edges) {
      entryRecorder.recordEdge(edge);
    }

    // Get all node types from the database
    const nodeTypes = await this.schemaService.getNodeTypes();

    for (const nodeType of nodeTypes) {
      entryRecorder.recordNodeType(nodeType);
    }

    // Get all edge types from the database
    const edgeTypes = await this.schemaService.getEdgeTypes();

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
