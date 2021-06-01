import { FilterCondition } from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';

/**
 * Allows to validate a filter condition.
 */
export default class FilterConditionValidator extends FilterConditionVisitor {
  private static validator = new FilterConditionValidator();

  private constructor() {
    super();
  }

  /**
   * Validates the specified filter condition to be well-formed.
   * @param condition The filter condition to validate.
   * @returns A boolean value indicating whether the filter condition is well-formed.
   */
  public static isValid(condition: FilterCondition): boolean {
    try {
      FilterConditionValidator.validator.visit(condition);
      return true;
    } catch (ArgumentError) {
      return false;
    }
  }
}
