import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { SearchResult } from '../../shared/search';
import { CancellationToken } from '../../utils/CancellationToken';
import HttpService from '../http';
import SearchService from './SearchService';

/**
 * The implementation of query service that performs query requests
 * via the backend.
 */
@injectable()
export default class SearchServiceImpl extends SearchService {
  @inject(HttpService)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly http: HttpService = null!;

  public fullTextSearch(
    searchString: string,
    cancellation?: CancellationToken
  ): Promise<SearchResult> {
    const url = `/api/search/all?filter=${searchString}`;

    return this.http.get<SearchResult>(url, cancellation);
  }
}
