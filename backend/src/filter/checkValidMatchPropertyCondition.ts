import { MatchPropertyCondition } from '../shared/queries';
import { FilterConditionValidationResult } from './FilterConditionValidationResult';

export function checkValidMatchPropertyCondition(
  condition: MatchPropertyCondition
): FilterConditionValidationResult {
  if (
    condition.property === undefined ||
    typeof condition.property !== 'string'
  ) {
    return { invalidProperty: 'property', type: 'string' };
  }

  if (condition.value === undefined) {
    return { invalidProperty: 'value' };
  }

  return {};
}
