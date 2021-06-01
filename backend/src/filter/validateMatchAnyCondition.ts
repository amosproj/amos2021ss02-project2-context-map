import { ArgumentError } from '../shared/errors';
import { FilterCondition, MatchAnyCondition } from '../shared/queries';
import { formatErrorMessage } from './formatErrorMessage';

/**
 * Checks the specified filter condition to be a valid MatchAnyCondition and converts it.
 * @param condition The condition to check.
 * @returns The converted filter condition.
 */
export function validateMatchAnyCondition(
  condition: FilterCondition
): MatchAnyCondition {
  const result = <MatchAnyCondition>condition;

  if (result.filters === undefined || !Array.isArray(result.filters)) {
    throw new ArgumentError(
      formatErrorMessage('MatchAnyCondition', 'filters', 'string[]')
    );
  }

  return result;
}
