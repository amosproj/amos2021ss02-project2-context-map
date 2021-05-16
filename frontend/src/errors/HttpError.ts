/**
 * An error that indicates that an HTTP request failed.
 */
export default class HttpError extends Error {
  public constructor(
    public readonly status: number,
    public readonly statusText: string
  ) {
    super(
      `The response contains a failure error code: ${status} ${statusText}`
    );
  }
}
