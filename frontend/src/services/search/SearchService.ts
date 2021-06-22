/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { SearchResult } from '../../shared/search';

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
   * @returns Observable that when evaluated, emits a {@link SearchResult} (nodes, edges, edgetypes and nodetypes) and completes.
   */
  public abstract fullTextSearch(
    searchString: string
  ): Observable<SearchResult>;
}
