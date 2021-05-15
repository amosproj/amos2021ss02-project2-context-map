/* eslint-disable max-classes-per-file */
import { injectable } from 'inversify';
import 'reflect-metadata';
import ArgumentError from '../errors/ArgumentError';
import CancellationError from '../utils/CancellationError';
import { CancellationToken } from '../utils/CancellationToken';
import nop from '../utils/nop';
import { HTTPHelperOptions } from './HTTPHelperOptions';
import NetworkError from './NetworkError';

interface HTTPHeaderCollection {
  [key: string]: string | undefined;
}

type URLQueryValueType = number | string | (number | string)[];

interface URLQuery {
  [key: string]: URLQueryValueType;
}

export abstract class HTTPRequest {
  // TODO: Why is this constructor useless? It protects the class to be consistent.
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public readonly headers: HTTPHeaderCollection = {},
    public readonly query: URLQuery = {}
  ) {}
}

export class HTTPGETRequest extends HTTPRequest {
  // TODO: Why is this constructor useless? It protects the class to be consistent.
  // eslint-disable-next-line no-useless-constructor
  public constructor(headers: HTTPHeaderCollection = {}, query: URLQuery = {}) {
    super(headers, query);
  }
}

export class HTTPPOSTRequest extends HTTPRequest {
  // TODO: Why is this constructor useless? It protects the class to be consistent.
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public readonly body: any,
    headers: HTTPHeaderCollection = {},
    query: URLQuery = {}
  ) {
    super(headers, query);
  }
}

export class HTTPResponse<TResult> {
  // TODO: Why is this constructor useless? It protects the class to be consistent.
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public readonly result: TResult | null,
    public readonly headers: HTTPHeaderCollection,
    public readonly status: number,
    public readonly statusText: string
  ) {}
}

function parseResponseHeaders(headers: string): HTTPHeaderCollection {
  /* Example:
   * date: Fri, 08 Dec 2017 21:04:30 GMT\r\n
   * content-encoding: gzip\r\n
   * x-content-type-options: nosniff\r\n
   */
  const headerKVPs = headers.split('\r\n');
  const result: HTTPHeaderCollection = {};
  for (let i = 0; i < headerKVPs.length; i += 1) {
    // Example: date: Fri, 08 Dec 2017 21:04:30 GMT\r\n
    const kvp = headerKVPs[i];
    const indexOfColon = kvp.indexOf(':');

    // A colon was not found in the header line.
    // This is a malformed header line.
    if (indexOfColon >= 0) {
      const key = kvp.slice(0, indexOfColon).trim();
      const value = kvp.slice(indexOfColon + 1).trim();

      if (key.length > 0 && value.length > 0) {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Builds the query service options.
 * @param options The partial options that very specified externally.
 * @returns The built options.
 */
function buildOptions(options: Partial<HTTPHelperOptions>): HTTPHelperOptions {
  let { baseUri } = options;

  // As per the spec of HTTPHelperOptions, we use the base URI of the source the frontend
  // was loaded from, if no base uri was specified in the options.
  if (!baseUri) {
    const { location } = window;
    baseUri = `${location.protocol}//${location.host}/${
      location.pathname.split('/')[1]
    }`;
  }

  return { baseUri };
}

@injectable()
export default class HTTPHelper {
  private readonly options: HTTPHelperOptions;

  public constructor(options: Partial<HTTPHelperOptions> = {}) {
    this.options = buildOptions(options);
  }

  public tryPost<TResult>(
    url: string | URL,
    request: HTTPPOSTRequest,
    cancellation?: CancellationToken
  ): Promise<HTTPResponse<TResult>> {
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
    request: HTTPRequest,
    method: 'post' | 'get' | 'head' | 'put' | 'delete' | 'patch',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    body?: any,
    cancellation?: CancellationToken
  ): Promise<HTTPResponse<TResult>> {
    // Pre-process arguments, extract the header collection and set a default content type header, that can be overridden by the caller.
    const headers: HTTPHeaderCollection = {
      'Content-Type': 'application/json',
      ...request.headers,
    };

    const parsedURL = this.appendQuery(url, request.query);

    return new Promise<HTTPResponse<TResult>>((resolve, reject) => {
      // If the cancellation token is already canceled, we can reject right away.
      if (cancellation?.isCancellationRequested) {
        reject(new CancellationError());
      }

      const httpClient = new XMLHttpRequest();
      httpClient.open(method, parsedURL.href, true);

      // Process the request-headers
      // Walk over all attributes of the 'headers' object and set the key-value pairs as request header.
      const keys = Object.keys(headers);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const value = headers[key];

        if (typeof value === 'string') {
          httpClient.setRequestHeader(key, value);
        } else {
          throw new ArgumentError(
            'The header collection is not a valid set of key-value pairs.',
            'headers'
          );
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

        const response = new HTTPResponse<TResult>(
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

  public post<TResult>(
    url: string | URL,
    request: HTTPPOSTRequest,
    cancellation?: CancellationToken
  ): Promise<TResult>;

  public post<TResult>(
    url: string | URL,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    body: any,
    cancellation?: CancellationToken
  ): Promise<TResult>;

  public async post<TResult>(
    url: string | URL,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    requestOrBody: HTTPPOSTRequest | any,
    cancellation?: CancellationToken
  ): Promise<TResult> {
    let request: HTTPPOSTRequest;
    if (requestOrBody instanceof HTTPPOSTRequest) {
      request = requestOrBody;
    } else {
      request = new HTTPPOSTRequest(requestOrBody);
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

    throw Error(httpResponse.statusText);
  }

  private appendQuery(url: URL | string, query: URLQuery): URL {
    let queryString = '';
    const keys = Object.keys(query);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const value = query[key];

      if (Array.isArray(value)) {
        for (let j = 0; j < value.length; j += 1) {
          const arrayValue = value[j];
          if (i > 0 || j > 0) {
            queryString += '&';
          }
          queryString += `${key}=${arrayValue.toString()}`;
        }
      } else {
        if (i > 0) {
          queryString += '&';
        }
        queryString += `${key}=${value.toString()}`;
      }
    }

    const result =
      url instanceof URL ? url : new URL(url, this.options.baseUri);

    if (queryString.length > 0) {
      if (
        !result.search ||
        result.search.length === 0 ||
        (result.search.length === 1 && result.search.charAt(0) === '?')
      ) {
        result.search = `?${queryString}`;
      } else {
        result.search = `${result.search}&${queryString}`;
      }
    }

    return result;
  }
}
