import { ArgumentError } from '../shared/errors';
import { FilterCondition, MatchAnyCondition } from '../shared/queries';
import { formatErrorMessage } from './formatErrorMessage';
import { checkValidMatchAllAnyCondition } from './checkValidMatchAllAnyCondition';

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
