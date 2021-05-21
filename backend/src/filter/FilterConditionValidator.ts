import { FilterCondition } from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';

export default class FilterConditionValidator extends FilterConditionVisitor {
  public isValid(condition: FilterCondition): boolean {
    try {
      super.visit(condition);
      return true;
    } catch (ArgumentError) {
      return false;
    }
  }
}
