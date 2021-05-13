/**
 * An error that indicated that an argument passed to a function was not expected.
 */
export default class ArgumentError extends Error {
  public constructor(message?: string, public readonly argument?: string) {
    super(message ?? 'An argument passed to the function was not expected.');
  }
}
