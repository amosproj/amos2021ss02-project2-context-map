import { MatchAllCondition, MatchAnyCondition } from '../shared/queries';
import { FilterConditionValidationResult } from './FilterConditionValidationResult';

/**
 * Checks the specified filter condition to be valid.
 * @param condition The condition to check.
 * @returns A validation result that described the validity of the condition.
 */
export function checkValidMatchAllAnyCondition(
  condition: MatchAllCondition | MatchAnyCondition
): FilterConditionValidationResult {
  if (condition.filters === undefined || !Array.isArray(condition.filters)) {
    return { invalidProperty: 'filters', type: 'string[]' };
  }

  return {};
}
