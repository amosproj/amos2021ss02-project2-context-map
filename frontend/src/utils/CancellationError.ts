export default class CancellationError extends Error {
  constructor() {
    super('The operation was cancelled.');
  }
}
