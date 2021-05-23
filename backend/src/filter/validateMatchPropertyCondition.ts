import { ArgumentError } from '../shared/errors';
import { FilterCondition, MatchPropertyCondition } from '../shared/queries';
import { checkValidMatchPropertyCondition } from './checkValidMatchPropertyCondition';
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
  const validationResult = checkValidMatchPropertyCondition(result);

  if (validationResult.invalidProperty !== undefined) {
    throw new ArgumentError(
      formatErrorMessage(
        'MatchPropertyCondition',
        validationResult.invalidProperty,
        validationResult.type
      )
    );
  }

  return result;
}
