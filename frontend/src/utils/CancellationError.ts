/**
 * An error that indicated that an operation was canceled.
 */
export default class CancellationError extends Error {
  constructor() {
    super('The operation was cancelled.');
  }
}
