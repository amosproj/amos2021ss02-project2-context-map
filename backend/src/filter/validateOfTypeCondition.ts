import { ArgumentError } from '../shared/errors';
import { FilterCondition, OfTypeCondition } from '../shared/queries';
import { checkValidOfTypeCondition } from './checkValidOfTypeCondition';
import { formatErrorMessage } from './formatErrorMessage';

export function validateOfTypeCondition(
  condition: FilterCondition
): OfTypeCondition {
  const result = <OfTypeCondition>condition;

  const validationResult = checkValidOfTypeCondition(result);

  if (validationResult.invalidProperty !== undefined) {
    throw new ArgumentError(
      formatErrorMessage(
        'OfTypeCondition',
        validationResult.invalidProperty,
        validationResult.type
      )
    );
  }

  return result;
}
