/* istanbul ignore file */

import { SearchResult } from '../shared/search/SearchResult';

export abstract class SearchServiceBase {
  public abstract search(searchString: string): Promise<SearchResult>;

  public abstract getAutoSuggestions(searchString: string): Promise<string[]>;
}
