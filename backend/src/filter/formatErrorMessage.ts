export function formatErrorMessage(
  filter: string,
  property: string,
  type?: string
): string {
  if (type) {
    return `Malformed filter condition. A filter condition of type '${filter}' must have a property '${property}' of type '${type}'.`;
  }

  return `Malformed filter condition. A filter condition of type '${filter}' must have a property '${property}'.`;
}
