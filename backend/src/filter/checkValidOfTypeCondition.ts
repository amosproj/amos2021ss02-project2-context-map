import { OfTypeCondition } from '../shared/queries';
import { FilterConditionValidationResult } from './FilterConditionValidationResult';

export function checkValidOfTypeCondition(
  condition: OfTypeCondition
): FilterConditionValidationResult {
  if (condition.type === undefined || typeof condition.type !== 'string') {
    return { invalidProperty: 'type', type: 'string' };
  }

  return {};
}
