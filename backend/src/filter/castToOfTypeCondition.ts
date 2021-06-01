import { ArgumentError } from '../shared/errors';
import { FilterCondition, OfTypeCondition } from '../shared/queries';
import { formatErrorMessage } from './formatErrorMessage';

/**
 * Checks the specified filter condition to be a valid OfTypeCondition and converts it.
 * @param condition The condition to check.
 * @returns The converted filter condition.
 */
export function castToOfTypeCondition(
  condition: FilterCondition
): OfTypeCondition {
  const result = <OfTypeCondition>condition;

  if (result.type === undefined || typeof result.type !== 'string') {
    throw new ArgumentError(
      formatErrorMessage('OfTypeCondition', 'type', 'string')
    );
  }

  return result;
}
