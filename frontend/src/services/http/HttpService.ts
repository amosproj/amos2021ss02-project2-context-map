/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { Observable, OperatorFunction, pipe, throwError } from 'rxjs';
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import HttpError from './HttpError';
import HttpServiceOptions from './HttpServiceOptions';
import HttpRequest from './HttpRequest';
import HttpGetRequest from './HttpGetRequest';
import HttpPostRequest from './HttpPostRequest';
import appendQuery from './appendQuery';

/**
 * Builds the query service options.
 * @param options The partial options that very specified externally.
 * @returns The built options.
 */
function buildOptions(
  options: Partial<HttpServiceOptions>
): HttpServiceOptions {
  let { baseUri } = options;

  // As per the spec of HttpServiceOptions, we use the base URI of the source the frontend
  // was loaded from, if no base uri was specified in the options.
  if (!baseUri) {
    baseUri = window.location.origin;
  }

  return { baseUri };
}

@injectable()
export default class HttpService {
  private readonly options: HttpServiceOptions;

  public constructor(options: Partial<HttpServiceOptions> = {}) {
    this.options = buildOptions(options);
  }

  public get<TResult>(
    url: string | URL,
    request?: HttpGetRequest
  ): Observable<TResult> {
    const parsedUrl = this.getParsedUrl(url, request);

    return ajax
      .get<TResult>(parsedUrl.href, request?.headers)
      .pipe(this.getDefaultPipe());
  }

  public post<TResult>(
    url: string | URL,
    requestOrBody: HttpPostRequest | unknown
  ): Observable<TResult> {
    let request: HttpPostRequest;
    if (requestOrBody instanceof HttpPostRequest) {
      request = requestOrBody;
    } else {
      request = new HttpPostRequest(requestOrBody);
    }

    const parsedUrl = this.getParsedUrl(url, request);

    return ajax
      .post<TResult>(parsedUrl.href, request.body, request.headers)
      .pipe(this.getDefaultPipe());
  }

  private getDefaultPipe<TResult>(): OperatorFunction<
    AjaxResponse<TResult>,
    TResult
  > {
    return pipe(
      // Only return the response body
      map((x) => x.response),
      catchError((error) => {
        // In case of an error: Throw it
        if (error instanceof AjaxError) {
          return throwError(() => new HttpError(error.status, error.message));
        }
        return throwError(() => error);
      })
    );
  }

  private getParsedUrl(url: string | URL, request?: HttpRequest) {
    return appendQuery(
      url instanceof URL ? url : new URL(url, this.options.baseUri),
      request?.query ?? {}
    );
  }
}
