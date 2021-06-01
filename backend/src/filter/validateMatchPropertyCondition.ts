import { ArgumentError } from '../shared/errors';
import { FilterCondition, MatchPropertyCondition } from '../shared/queries';
import { formatErrorMessage } from './formatErrorMessage';

/**
 * Checks the specified filter condition to be a valid MatchPropertyCondition and converts it.
 * @param condition The condition to check.
 * @returns The converted filter condition.
 */
export function validateMatchPropertyCondition(
  condition: FilterCondition
): MatchPropertyCondition {
  const result = <MatchPropertyCondition>condition;

  if (result.property === undefined || typeof result.property !== 'string') {
    throw new ArgumentError(
      formatErrorMessage('MatchPropertyCondition', 'property', 'string')
    );
  }

  if (result.value === undefined) {
    throw new ArgumentError(
      formatErrorMessage('MatchPropertyCondition', 'value')
    );
  }

  return result;
}
