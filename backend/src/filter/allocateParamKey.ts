import { QueryParams } from './FilterConditionBuilder';

export function allocateParamKey(params: QueryParams, name: string): string {
  let additionalNum = 0;
  let paramName = name;

  while (params[paramName] !== undefined) {
    additionalNum += 1;
    paramName = `${name}_${additionalNum}`;
  }

  return paramName;
}
