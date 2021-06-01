import { QueryParams } from './QueryParams';

export function allocateParamKey(
  queryParams: QueryParams,
  name: string
): string {
  let additionalNum = 0;
  let paramName = name;

  while (queryParams[paramName] !== undefined) {
    additionalNum += 1;
    paramName = `${name}_${additionalNum}`;
  }

  return paramName;
}
