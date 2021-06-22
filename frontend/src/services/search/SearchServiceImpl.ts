import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { SearchResult } from '../../shared/search';
import HttpService from '../http';
import SearchService from './SearchService';

/**
 * The implementation of query service that performs query requests
 * via the backend.
 */
@injectable()
export default class SearchServiceImpl extends SearchService {
  @inject(HttpService)
  private readonly http!: HttpService;

  public fullTextSearch(searchString: string): Observable<SearchResult> {
    const url = `/api/search/all?filter=${searchString}`;
    return this.http.get<SearchResult>(url);
  }
}
