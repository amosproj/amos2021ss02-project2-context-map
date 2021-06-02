import MiniSearch from 'minisearch';
import { AsyncLazy } from '../shared/utils';
import {
  SearchEdgeResult,
  SearchNodeResult,
  SearchResult,
} from '../shared/search';
import { IndexEntry } from './IndexEntry';
import { SearchIndexEntryRecorder } from './SearchIndexEntryRecorder';
import { AppService } from '../app.service';
import { SchemaService } from '../schema/schema.service';

/**
 * Represents a search index that can be used to perform search operations and auto suggestions.
 */
export class SearchIndex {
  private constructor(private readonly index: AsyncLazy<MiniSearch>) {}

  public static create(
    queryService: AppService,
    schemaService: SchemaService
  ): SearchIndex {
    return new SearchIndex(
      new AsyncLazy<MiniSearch>(() =>
        SearchIndex.createCore(queryService, schemaService)
      )
    );
  }

  private static async createCore(
    queryService: AppService,
    schemaService: SchemaService
  ): Promise<MiniSearch> {
    const entryRecorder = new SearchIndexEntryRecorder();

    // TODO: For large databases it would be beneficial, if we read the entries in smaller batches,
    //       so we don't have to copy the entire dataset into memory (again).
    //       The problem here, is that we need the property names before adding the entries to the
    //       index. This can be done by executing an up-front query for the schema of the data,
    //       as is done in the SchemaService.

    // Get all nodes from the database
    const nodes = await queryService.getNodes();

    for (const node of nodes) {
      entryRecorder.recordNode(node);
    }

    // Get all edges from the database
    const edges = await queryService.getEdges();

    for (const edge of edges) {
      entryRecorder.recordEdge(edge);
    }

    // Get all node types from the database
    const nodeTypes = await schemaService.getNodeTypes();

    for (const nodeType of nodeTypes) {
      entryRecorder.recordNodeType(nodeType);
    }

    // Get all edge types from the database
    const edgeTypes = await schemaService.getEdgeTypes();

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
    const entries = index
      .search(searchString, { prefix: true })
      .map((result) => (result as unknown) as IndexEntry);

    const result = this.createEmptySearchResult();

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
      this.processSearchResultEntry(entry, result);
    }

    return result;
  }

  private createEmptySearchResult(): SearchResult {
    return {
      nodes: [],
      edges: [],
      nodeTypes: [],
      edgeTypes: [],
    };
  }

  private appendProperty(
    entry: IndexEntry,
    resultEntry: SearchNodeResult | SearchEdgeResult
  ) {
    if (entry.indexKey && entry.indexKey.startsWith('properties.')) {
      const propKey = entry.indexKey.slice('properties.'.length);
      const propValue = entry.indexValue;

      // This normally is bad, but we explicitly want to modify it here!
      // eslint-disable-next-line no-param-reassign
      resultEntry.properties = {
        ...resultEntry.properties,
        [propKey]: propValue,
      };
    }
  }

  /**
   * Processes a single entry that was returned from the search index and adds it to the aggregate search result.
   * @param entry The entry, as returned from the search index.
   * @param result The search result that contains the aggregated result.
   */
  private processSearchResultEntry(
    entry: IndexEntry,
    result: SearchResult
  ): void {
    // The entry describes a node.
    if (
      entry.entityType === 'node' &&
      typeof entry.id === 'number' &&
      Array.isArray(entry.types) &&
      entry.types.length > 0
    ) {
      let resultEntry = result.nodes.find((node) => node.id === entry.id);

      if (!resultEntry) {
        resultEntry = { id: entry.id, types: entry.types };
        result.nodes.push(resultEntry);
      }

      this.appendProperty(entry, resultEntry);

      return;
    }

    // The entry described an edge.
    if (
      entry.entityType === 'edge' &&
      typeof entry.id === 'number' &&
      typeof entry.from === 'number' &&
      typeof entry.to === 'number' &&
      Array.isArray(entry.types) &&
      entry.types.length === 1
    ) {
      let resultEntry = result.edges.find((edge) => edge.id === entry.id);

      if (!resultEntry) {
        resultEntry = {
          id: entry.id,
          type: entry.types[0],
          from: entry.from,
          to: entry.to,
        };

        result.edges.push(resultEntry);
      }

      this.appendProperty(entry, resultEntry);

      return;
    }

    // The entry describes a node-type.
    if (entry.entityType === 'node-type' && typeof entry.id === 'string') {
      if (!result.nodeTypes.some((nodeType) => nodeType.name === entry.id)) {
        result.nodeTypes.push({
          name: entry.id,
        });
      }
      return;
    }

    // The entry describes an edge-type.
    if (entry.entityType === 'edge-type' && typeof entry.id === 'string') {
      if (!result.edgeTypes.some((edgeType) => edgeType.name === entry.id)) {
        result.edgeTypes.push({
          name: entry.id,
        });
      }
    }
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
