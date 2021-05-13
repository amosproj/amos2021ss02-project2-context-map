import { injectable } from 'inversify';
import 'reflect-metadata';
import ArgumentError from '../errors/ArgumentError';
import CancellationError from '../utils/CancellationError';
import { CancellationToken } from '../utils/CancellationToken';
import nop from '../utils/nop';
import { HTTPHelperOptions } from './HTTPHelperOptions';
import NetworkError from './NetworkError';

interface HttpHeaderCollection {
  [key: string]: string | undefined;
}

interface HTTPResponse<TResult> {
  result: TResult | null;
  headers: HttpHeaderCollection;
  status: number;
  statusText: string;
}

function parseResponseHeaders(headers: string): HttpHeaderCollection {
  /* Example:
   * date: Fri, 08 Dec 2017 21:04:30 GMT\r\n
   * content-encoding: gzip\r\n
   * x-content-type-options: nosniff\r\n
   */
  const headerKVPs = headers.split('\r\n');
  const result: HttpHeaderCollection = {};
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    body: any,
    headers?: HttpHeaderCollection,
    cancellation?: CancellationToken
  ): Promise<HTTPResponse<TResult>>;

  public tryPost<TResult>(
    url: string | URL,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    body: any,
    cancellation?: CancellationToken
  ): Promise<HTTPResponse<TResult>>;

  // eslint-disable-next-line class-methods-use-this
  public tryPost<TResult>(
    url: string | URL,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    body: any,
    headersOrCancellation?: CancellationToken | HttpHeaderCollection,
    cancellation?: CancellationToken
  ): Promise<HTTPResponse<TResult>> {
    // Pre-process arguments, extract the header collection and set a default content type header, that can be overridden by the caller.
    let headers: HttpHeaderCollection = { 'Content-Type': 'application/json' };
    let resolvedCancellation = cancellation;

    if (headersOrCancellation instanceof CancellationToken) {
      resolvedCancellation = headersOrCancellation;
    } else {
      headers = { ...headers, ...headersOrCancellation };
    }

    let parsedURL: URL;

    if (typeof url === 'string') {
      parsedURL = new URL(url, this.options.baseUri);
    } else {
      parsedURL = url;
    }

    return new Promise<HTTPResponse<TResult>>((resolve, reject) => {
      // If the cancellation token is already canceled, we can reject right away.
      if (resolvedCancellation?.isCancellationRequested) {
        reject(new CancellationError());
      }

      const request = new XMLHttpRequest();
      request.open('post', parsedURL.href, true);

      // Process the request-headers
      // Walk over all attributes of the 'headers' object and set the key-value pairs as request header.
      const keys = Object.keys(headers);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const value = headers[key];

        if (typeof value === 'string') {
          request.setRequestHeader(key, value);
        } else {
          throw new ArgumentError(
            'The header collection is not a valid set of key-value pairs.',
            'headers'
          );
        }
      }

      // Register to the cancellation token, if present.
      let cancellationUnsubscribe = nop;
      if (resolvedCancellation) {
        cancellationUnsubscribe = resolvedCancellation.subscribe(() =>
          request.abort()
        );
      }

      // Callback that is executed, when the load operation was performed.
      // This does not necessarily mean, that everything was successful.
      request.onload = () => {
        // Unsubscribe from the cancellation token.
        cancellationUnsubscribe();

        const response: HTTPResponse<TResult> = {
          status: request.status,
          statusText: request.statusText,
          headers: parseResponseHeaders(request.getAllResponseHeaders()),
          result: null,
        };

        // Check the HTTP response status code to be in the success range.
        if (request.status >= 200 && request.status <= 299) {
          response.result = JSON.parse(request.response);
        }

        resolve(response);
      };

      // Callback that is executed, when the load operation failed due to a network error.
      request.onerror = () => {
        // Unsubscribe from the cancellation token.
        cancellationUnsubscribe();

        // Double check whether cancellation was requested.
        if (resolvedCancellation?.isCancellationRequested) {
          reject(new CancellationError());
        } else {
          reject(new NetworkError());
        }
      };

      // Callback that is executed, when the load operation was aborted due to cancellation.
      request.onabort = () => {
        // Unsubscribe from the cancellation token.
        cancellationUnsubscribe();

        reject(new CancellationError());
      };

      // Start the request
      request.send(JSON.stringify(body ?? {}));
    });
  }

  public post<TResult>(
    url: string | URL,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    body: any,
    headers?: HttpHeaderCollection,
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
    body: any,
    headersOrCancellation?: CancellationToken | HttpHeaderCollection,
    cancellation?: CancellationToken
  ): Promise<TResult> {
    let resolvedHeaders: HttpHeaderCollection = {};
    let resolvedCancellation = cancellation;

    if (headersOrCancellation instanceof CancellationToken) {
      resolvedCancellation = headersOrCancellation;
    } else if (headersOrCancellation) {
      resolvedHeaders = headersOrCancellation;
    }

    const httpResponse = await this.tryPost<TResult>(
      url,
      body,
      resolvedHeaders,
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

    throw Error(httpResponse.statusText);
  }
}
