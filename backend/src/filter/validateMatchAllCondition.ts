import { ArgumentError } from '../shared/errors';
import { FilterCondition, MatchAllCondition } from '../shared/queries';
import { formatErrorMessage } from './formatErrorMessage';

/**
 * Checks the specified filter condition to be a valid MatchAllCondition and converts it.
 * @param condition The condition to check.
 * @returns The converted filter condition.
 */
export function validateMatchAllCondition(
  condition: FilterCondition
): MatchAllCondition {
  const result = <MatchAllCondition>condition;

  if (result.filters === undefined || !Array.isArray(result.filters)) {
    throw new ArgumentError(
      formatErrorMessage('MatchAllCondition', 'filters', 'string[]')
    );
  }

  return result;
}
