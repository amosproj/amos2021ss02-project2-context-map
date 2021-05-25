/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { SearchResult } from '../shared/search/SearchResult';
import { CancellationToken } from '../utils/CancellationToken';

/**
 * A service that can be used to perform full text database searches.
 */
@injectable()
export default abstract class SearchService {
  /**
   * Searches through all entities and entity types and returns those, that
   * match the searchString. Only returns those values with the prefix of searchStrings.
   * Values with n spaces are considered as n+1 single values.
   * @param searchString The string to search for.
   * @param cancellation A CancellationToken used to cancel the asynchronous operation.
   * @returns A promise that when evaluated, contains a {@link SearchResult} (nodes, edges, edgetypes and nodetypes).
   */
  public abstract fullTextSearch(
    searchString: string,
    cancellation?: CancellationToken
  ): Promise<SearchResult>;
}
