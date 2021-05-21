export default function any<T>(
  iterable: Iterable<T>,
  predicate?: (t: T) => boolean
): boolean {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of iterable) {
    if (!predicate || predicate(item)) {
      return true;
    }
  }

  return false;
}
