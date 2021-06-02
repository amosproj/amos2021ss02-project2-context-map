import { flattenArray } from './flattenArray';

/**
 * Converts the specified value to string or return null if the value cannot be converted.
 * @param value The value to stringify.
 * @returns The stringified version of the value, or null of the value cannot be converted.
 */
export function convertToString(value: unknown): string | null {
  // If the value is a string, we are done.
  if (typeof value === 'string') {
    return value;
  }

  // If the value is an array, convert each element and combine them via flattenArray.
  if (Array.isArray(value)) {
    if (value.length > 1) {
      return flattenArray(
        <string[]>(
          value.map((entry) => convertToString(entry)).filter((entry) => entry)
        )
      );
    }

    return convertToString(value[0]);
  }

  // Try to invoke a 'toString()' function, that may be present.
  if (typeof value === 'object' && typeof value?.toString === 'function') {
    const result = value.toString();

    if (typeof result === 'string') {
      return result;
    }
  }

  // The value cannot be stringified.
  return null;
}
