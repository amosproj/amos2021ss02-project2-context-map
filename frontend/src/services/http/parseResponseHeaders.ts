import HttpHeaderCollection from './HttpHeaderCollection';

export default function parseResponseHeaders(
  headers: string
): HttpHeaderCollection {
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
