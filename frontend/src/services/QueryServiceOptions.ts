/**
 * Contains options for the query service.
 */
export interface QueryServiceOptions {
  /**
   * The base URI of the backend to use.
   * If not specified, uses the base URI of the source the frontend was loaded from.
   */
  backendBaseUri: string;
}
