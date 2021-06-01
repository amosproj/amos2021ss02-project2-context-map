import MiniSearch from 'minisearch';
import { AsyncLazy } from '../shared/utils';
import {
  SearchEdgeResult,
  SearchNodeResult,
  SearchResult,
} from '../shared/search';
import { IndexEntry } from './IndexEntry';

/**
 * Represents a search index that can be used to perform search operations and auto suggestions.
 */
export class SearchIndex {
  public constructor(private readonly index: AsyncLazy<MiniSearch>) {}

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
