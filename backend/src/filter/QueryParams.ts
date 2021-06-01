/**
 * Represents the parameter of a database query.
 */
export interface QueryParams {
  /**
   * Gets or sets a database parameter by its key.
   */
  [key: string]: unknown | undefined;
}
