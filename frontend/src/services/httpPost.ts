import ArgumentError from '../errors/ArgumentError';
import CancellationError from '../utils/CancellationError';
import { CancellationToken } from '../utils/CancellationToken';
import nop from '../utils/nop';

/**
 * An error that indicates that a network error occurred.
 */
export class NetworkError extends Error {
  constructor() {
    super('A network error occurred.');
  }
}

interface HttpHeaderCollection {
  [key: string]: string | undefined;
}

export function httpPost<TResult>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  headers?: HttpHeaderCollection,
  cancellation?: CancellationToken
): Promise<TResult>;
export function httpPost<TResult>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  cancellation?: CancellationToken
): Promise<TResult>;
export function httpPost<TResult>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  body: any,
  headersOrCancellation?: CancellationToken | HttpHeaderCollection,
  cancellation?: CancellationToken
): Promise<TResult> {
  // Pre-process arguments, extract the header collection and set a default content type header, that can be overridden by the caller.
  let headers: HttpHeaderCollection = { 'Content-Type': 'application/json' };
  let resolvedCancellation = cancellation;

  if (headersOrCancellation instanceof CancellationToken) {
    resolvedCancellation = headersOrCancellation;
  } else {
    headers = { ...headers, ...headersOrCancellation };
  }

  return new Promise<TResult>((resolve, reject) => {
    // If the cancellation token is already canceled, we can reject right away.
    if (resolvedCancellation?.isCancellationRequested) {
      reject(new CancellationError());
    }

    const request = new XMLHttpRequest();
    request.open('post', url, true);

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

      // Check the HTTP response status code to be in the success range.
      if (request.status >= 200 && request.status <= 299) {
        resolve(JSON.parse(request.response)); // TODO: Validate the response?
      } else {
        // TODO: If we get a response of any of
        // * 301 Moved Permanently
        // * 302 Found (Moved Temporarily)
        // * 307 Temporary Redirect
        // * 308 	Permanent Redirect
        // we can request again with the url in the Location header of the response.
        reject(Error(request.statusText));
      }
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
