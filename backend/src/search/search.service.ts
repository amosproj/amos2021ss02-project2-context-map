import { Injectable } from '@nestjs/common';
import { SearchResult } from '../shared/search';
import { SearchServiceBase } from './search.service.base';
import { SearchIndexBuilder } from './SearchIndexBuilder';
import { SearchIndex } from './SearchIndex';

@Injectable()
export class SearchService implements SearchServiceBase {
  private readonly index: SearchIndex;

  constructor(searchIndexBuilder: SearchIndexBuilder) {
    this.index = searchIndexBuilder.buildIndex();
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
    return this.index.search(searchString);
  }

  public async getAutoSuggestions(searchString: string): Promise<string[]> {
    return this.index.getAutoSuggestions(searchString);
  }
}
