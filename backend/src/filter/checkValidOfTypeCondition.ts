import { OfTypeCondition } from '../shared/queries';
import { FilterConditionValidationResult } from './FilterConditionValidationResult';

/**
 * Checks the specified filter condition to be valid.
 * @param condition The condition to check.
 * @returns A validation result that described the validity of the condition.
 */
export function checkValidOfTypeCondition(
  condition: OfTypeCondition
): FilterConditionValidationResult {
  if (condition.type === undefined || typeof condition.type !== 'string') {
    return { invalidProperty: 'type', type: 'string' };
  }

  return {};
}
