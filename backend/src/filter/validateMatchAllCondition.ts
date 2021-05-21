import { ArgumentError } from '../shared/errors';
import { FilterCondition, MatchAllCondition } from '../shared/queries';
import { formatErrorMessage } from './formatErrorMessage';
import { checkValidMatchAllAnyCondition } from './checkValidMatchAllAnyCondition';

/**
 * Checks the specified filter condition to be a valid MatchAllCondition and converts it.
 * @param condition The condition to check.
 * @returns The converted filter condition.
 */
export function validateMatchAllCondition(
  condition: FilterCondition
): MatchAllCondition {
  const result = <MatchAllCondition>condition;
  const validationResult = checkValidMatchAllAnyCondition(result);

  if (validationResult.invalidProperty !== undefined) {
    throw new ArgumentError(
      formatErrorMessage(
        'MatchAllCondition',
        validationResult.invalidProperty,
        validationResult.type
      )
    );
  }

  return result;
}
