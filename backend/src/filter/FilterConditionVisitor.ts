import {
  FilterCondition,
  OfTypeCondition,
  MatchPropertyCondition,
  MatchAnyCondition,
  MatchAllCondition,
} from '../shared/queries';

export default abstract class FilterConditionVisitor {
  protected visit(condition: FilterCondition): FilterCondition {
    if (condition.rule === 'of-type') {
      // TODO: Check whether required properties are set.
      return this.visitOfTypeCondition(<OfTypeCondition>condition);
    }

    if (condition.rule === 'match-property') {
      // TODO: Check whether required properties are set.
      return this.visitMatchPropertyCondition(
        <MatchPropertyCondition>condition
      );
    }

    if (condition.rule === 'all') {
      // TODO: Check whether required properties are set.
      return this.visitMatchAllCondition(<MatchAllCondition>condition);
    }

    if (condition.rule === 'any') {
      // TODO: Check whether required properties are set.
      return this.visitMatchAnyCondition(<MatchAnyCondition>condition);
    }

    return condition;
  }

  // eslint-disable-next-line class-methods-use-this
  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    return condition;
  }

  // eslint-disable-next-line class-methods-use-this
  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    return condition;
  }

  // eslint-disable-next-line class-methods-use-this
  protected visitMatchAllCondition(
    condition: MatchAllCondition
  ): FilterCondition {
    return MatchAllCondition(...condition.filters.map((c) => this.visit(c)));
  }

  // eslint-disable-next-line class-methods-use-this
  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    return MatchAnyCondition(...condition.filters.map((c) => this.visit(c)));
  }
}
