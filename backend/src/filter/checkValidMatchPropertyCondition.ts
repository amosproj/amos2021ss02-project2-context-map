import { MatchPropertyCondition } from '../shared/queries';
import { FilterConditionValidationResult } from './FilterConditionValidationResult';

/**
 * Checks the specified filter condition to be valid.
 * @param condition The condition to check.
 * @returns A validation result that described the validity of the condition.
 */
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
