import { ArgumentError } from '../shared/errors';
import { FilterCondition, MatchAnyCondition } from '../shared/queries';
import { formatErrorMessage } from './formatErrorMessage';
import { checkValidMatchAllAnyCondition } from './checkValidMatchAllAnyCondition';

/**
 * Checks the specified filter condition to be a valid MatchAnyCondition and converts it.
 * @param condition The condition to check.
 * @returns The converted filter condition.
 */
export function validateMatchAnyCondition(
  condition: FilterCondition
): MatchAnyCondition {
  const result = <MatchAnyCondition>condition;
  const validationResult = checkValidMatchAllAnyCondition(result);

  if (validationResult.invalidProperty !== undefined) {
    throw new ArgumentError(
      formatErrorMessage(
        'MatchAnyCondition',
        validationResult.invalidProperty,
        validationResult.type
      )
    );
  }

  return result;
}
