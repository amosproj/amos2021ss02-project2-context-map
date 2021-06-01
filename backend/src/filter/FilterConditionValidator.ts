import { FilterCondition } from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';

export default class FilterConditionValidator extends FilterConditionVisitor {
  private static validator = new FilterConditionValidator();

  private constructor() {
    super();
  }

  public static isValid(condition: FilterCondition): boolean {
    try {
      FilterConditionValidator.validator.visit(condition);
      return true;
    } catch (ArgumentError) {
      return false;
    }
  }
}
