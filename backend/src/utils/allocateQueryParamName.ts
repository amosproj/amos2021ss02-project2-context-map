import { QueryParams } from './QueryParams';

/**
 * Allocates a unique database query parameter name for the specified suggested name.
 * @param queryParams The database query parameters object.
 * @param name The suggested database query parameter name.
 * @returns The allocated unique name.
 */
export function allocateQueryParamName(
  queryParams: QueryParams,
  name: string
): string {
  let additionalNum = 0;
  let paramName = name;

  // The idea here is that we start with the suggested name and test whether it is
  // already allocated in the query parameters instance. If it is not, we are done,
  // otherwise append a number (starting with 1) and increment the number as long
  // as the constructed name is already allocated.

  while (queryParams[paramName] !== undefined) {
    additionalNum += 1;
    paramName = `${name}_${additionalNum}`;
  }

  return paramName;
}
