import { injectable } from 'inversify';
import 'reflect-metadata';
import HttpError from './HttpError';
import CancellationError from '../../utils/CancellationError';
import { CancellationToken } from '../../utils/CancellationToken';
import nop from '../../utils/nop';
import HttpServiceOptions from './HttpServiceOptions';
import NetworkError from './NetworkError';
import HttpHeaderCollection from './HttpHeaderCollection';
import HttpRequest from './HttpRequest';
import HttpGetRequest from './HttpGetRequest';
import HttpPostRequest from './HttpPostRequest';
import HttpResponse from './HttpResponse';
import parseResponseHeaders from './parseResponseHeaders';
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

  public tryGet<TResult>(
    url: string | URL,
    request: HttpGetRequest,
    cancellation?: CancellationToken
  ): Promise<HttpResponse<TResult>> {
    return this.executeRequest(url, request, 'get', undefined, cancellation);
  }

  public tryPost<TResult>(
    url: string | URL,
    request: HttpPostRequest,
    cancellation?: CancellationToken
  ): Promise<HttpResponse<TResult>> {
    return this.executeRequest(
      url,
      request,
      'post',
      request.body,
      cancellation
    );
  }

  private executeRequest<TResult>(
    url: string | URL,
    request: HttpRequest,
    method: 'post' | 'get' | 'head' | 'put' | 'delete' | 'patch',
    body?: unknown,
    cancellation?: CancellationToken
  ): Promise<HttpResponse<TResult>> {
    // Pre-process arguments, extract the header collection and set a default content type header, that can be overridden by the caller.
    const headers: HttpHeaderCollection = {
      'Content-Type': 'application/json',
      ...request.headers,
    };

    const parsedURL = appendQuery(
      url instanceof URL ? url : new URL(url, this.options.baseUri),
      request.query
    );

    return new Promise<HttpResponse<TResult>>((resolve, reject) => {
      // If the cancellation token is already canceled, we can reject right away.
      if (cancellation?.isCancellationRequested) {
        reject(new CancellationError());
      }

      const httpClient = new XMLHttpRequest();
      httpClient.open(method, parsedURL.href, true);

      // Process the request-headers
      // Walk over all attributes of the 'headers' object and set the key-value pairs as request header.
      const keys = Object.keys(headers);
      for (const key of keys) {
        const value = headers[key];

        if (typeof value === 'string') {
          httpClient.setRequestHeader(key, value);
        }
      }

      // Register to the cancellation token, if present.
      let cancellationUnsubscribe = nop;
      if (cancellation) {
        cancellationUnsubscribe = cancellation.subscribe(() =>
          httpClient.abort()
        );
      }

      // Callback that is executed, when the load operation was performed.
      // This does not necessarily mean, that everything was successful.
      httpClient.onload = () => {
        // Unsubscribe from the cancellation token.
        cancellationUnsubscribe();

        let result: TResult | null = null;

        // Check the HTTP response status code to be in the success range.
        if (httpClient.status >= 200 && httpClient.status <= 299) {
          result = JSON.parse(httpClient.response);
        }

        const response = new HttpResponse<TResult>(
          result,
          parseResponseHeaders(httpClient.getAllResponseHeaders()),
          httpClient.status,
          httpClient.statusText
        );

        resolve(response);
      };

      // Callback that is executed, when the load operation failed due to a network error.
      httpClient.onerror = () => {
        // Unsubscribe from the cancellation token.
        cancellationUnsubscribe();

        // Double check whether cancellation was requested.
        if (cancellation?.isCancellationRequested) {
          reject(new CancellationError());
        } else {
          reject(new NetworkError());
        }
      };

      // Callback that is executed, when the load operation was aborted due to cancellation.
      httpClient.onabort = () => {
        // Unsubscribe from the cancellation token.
        cancellationUnsubscribe();

        reject(new CancellationError());
      };

      // Start the request
      httpClient.send(JSON.stringify(body ?? {}));
    });
  }

  public get<TResult>(
    url: string | URL,
    request: HttpGetRequest,
    cancellation?: CancellationToken
  ): Promise<TResult>;

  public get<TResult>(
    url: string | URL,
    cancellation?: CancellationToken
  ): Promise<TResult>;

  public async get<TResult>(
    url: string | URL,
    requestOrCancellation?: HttpGetRequest | CancellationToken,
    cancellation?: CancellationToken
  ): Promise<TResult> {
    let request: HttpGetRequest;
    let resolvedCancellation: CancellationToken | undefined = cancellation;
    if (requestOrCancellation instanceof HttpGetRequest) {
      request = requestOrCancellation;
    } else {
      request = new HttpGetRequest();
      resolvedCancellation = requestOrCancellation;
    }

    const httpResponse = await this.tryGet<TResult>(
      url,
      request,
      resolvedCancellation
    );

    // Check the HTTP response status code to be in the success range.
    if (
      httpResponse.status >= 200 &&
      httpResponse.status <= 299 &&
      httpResponse.result
    ) {
      return httpResponse.result;
    }

    throw new HttpError(httpResponse.status, httpResponse.statusText);
  }

  public post<TResult>(
    url: string | URL,
    request: HttpPostRequest,
    cancellation?: CancellationToken
  ): Promise<TResult>;

  public post<TResult>(
    url: string | URL,
    body: unknown,
    cancellation?: CancellationToken
  ): Promise<TResult>;

  public async post<TResult>(
    url: string | URL,
    requestOrBody: HttpPostRequest | unknown,
    cancellation?: CancellationToken
  ): Promise<TResult> {
    let request: HttpPostRequest;
    if (requestOrBody instanceof HttpPostRequest) {
      request = requestOrBody;
    } else {
      request = new HttpPostRequest(requestOrBody);
    }

    const httpResponse = await this.tryPost<TResult>(
      url,
      request,
      cancellation
    );

    // Check the HTTP response status code to be in the success range.
    if (
      httpResponse.status >= 200 &&
      httpResponse.status <= 299 &&
      httpResponse.result
    ) {
      return httpResponse.result;
    }

    throw new HttpError(httpResponse.status, httpResponse.statusText);
  }
}
