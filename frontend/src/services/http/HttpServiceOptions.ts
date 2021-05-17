/**
 * Contains options for the {@link HttpService}
 */
export default interface HttpServiceOptions {
  /**
   * The base URI to use.
   * If not specified, uses the base URI of the source the frontend was loaded from.
   */
  baseUri: string;
}
