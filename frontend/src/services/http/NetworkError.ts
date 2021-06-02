/* istanbul ignore file */

/**
 * An error that indicates that a network error occurred.
 */
export default class NetworkError extends Error {
  constructor() {
    super('A network error occurred.');
  }
}
