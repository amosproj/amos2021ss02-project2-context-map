import { MatchAnyCondition, MatchAllCondition } from '../shared/queries';
import { FilterConditionValidationResult } from './FilterConditionValidationResult';

export function checkValidMatchAllAnyCondition(
  condition: MatchAllCondition | MatchAnyCondition
): FilterConditionValidationResult {
  if (condition.filters === undefined || !Array.isArray(condition.filters)) {
    return { invalidProperty: 'filters', type: 'string[]' };
  }

  return {};
}
