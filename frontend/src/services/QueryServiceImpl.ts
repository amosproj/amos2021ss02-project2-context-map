import { injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../shared/queries/LimitQuery';
import { QueryResult } from '../shared/queries/QueryResult';
import { CancellationToken } from '../utils/CancellationToken';
import { httpPost } from './httpPost';
import QueryService from './QueryService';
import { QueryServiceOptions } from './QueryServiceOptions';

/**
 * Builds the query service options.
 * @param options The partial options that very specified externally.
 * @returns The built options.
 */
function buildOptions(
  options: Partial<QueryServiceOptions>
): QueryServiceOptions {
  let { backendBaseUri } = options;

  // As per the spec of QueryServiceOptions, we use the base URI of the source the frontend
  // was loaded from, if no backend base uri was specified in the options.
  if (!backendBaseUri) {
    const { location } = window;
    backendBaseUri = `${location.protocol}//${location.host}/${
      location.pathname.split('/')[1]
    }`;
  }

  return { backendBaseUri };
}

/**
 * The implementation of query service that performs query requests
 * via the backend.
 */
@injectable()
export default class QueryServiceImpl extends QueryService {
  private readonly options: QueryServiceOptions;

  public constructor(options: Partial<QueryServiceOptions> = {}) {
    super();

    this.options = buildOptions(options);
  }

  public queryAll(
    query?: LimitQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    const url = `${this.options.backendBaseUri}/queryAll`;

    return httpPost<QueryResult>(url, query, cancellation);
  }
}
