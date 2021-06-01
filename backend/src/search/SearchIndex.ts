import MiniSearch from 'minisearch';
import { AsyncLazy } from '../shared/utils';
import { SearchResult } from '../shared/search';
import { RestoredIndexEntry } from './RestoredIndexEntry';

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
      .map((result) => (result as unknown) as RestoredIndexEntry);

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

  /**
   * Processes a single entry that was returned from the search index and adds it to the aggregate search result.
   * @param entry The entry, as returned from the search index.
   * @param result The search result that contains the aggregated result.
   */
  private processSearchResultEntry(
    entry: RestoredIndexEntry,
    result: SearchResult
  ): void {
    // The entry describes a node.
    if (entry.entityType === 'node' && typeof entry.id === 'number') {
      result.nodes.push({ id: entry.id });
      return;
    }

    // The entry described an edge.
    if (
      entry.entityType === 'edge' &&
      typeof entry.id === 'number' &&
      typeof entry.from === 'number' &&
      typeof entry.to === 'number'
    ) {
      result.edges.push({
        id: entry.id,
        from: entry.from,
        to: entry.to,
      });
      return;
    }

    // The entry describes a node-type.
    if (entry.entityType === 'node-type' && typeof entry.id === 'string') {
      result.nodeTypes.push({
        name: entry.id,
      });
      return;
    }

    // The entry describes an edge-type.
    if (entry.entityType === 'edge-type' && typeof entry.id === 'string') {
      result.edgeTypes.push({
        name: entry.id,
      });
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
