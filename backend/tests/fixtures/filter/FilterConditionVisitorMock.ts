import FilterConditionVisitor from '../../../src/filter/FilterConditionVisitor';
import { FilterCondition } from '../../../src/shared/queries';

export default class FilterConditionVisitorMock extends FilterConditionVisitor {
  public visit(condition: FilterCondition): FilterCondition {
    return super.visit(condition);
  }
}
