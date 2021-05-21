import { ArgumentError } from '../shared/errors';
import { FilterCondition, MatchAllCondition } from '../shared/queries';
import { formatErrorMessage } from './formatErrorMessage';
import { checkValidMatchAllAnyCondition } from './checkValidMatchAllAnyCondition';

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
