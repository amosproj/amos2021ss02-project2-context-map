import { ArgumentError } from '../shared/errors';
import {
  FilterCondition,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import { castToMatchAllCondition } from './castToMatchAllCondition';
import { castToMatchAnyCondition } from './castToMatchAnyCondition';
import { castToMatchPropertyCondition } from './castToMatchPropertyCondition';
import { castToOfTypeCondition } from './castToOfTypeCondition';

export default abstract class FilterConditionVisitor {
  protected visit(condition: FilterCondition): FilterCondition {
    if (condition.rule === undefined || typeof condition.rule !== 'string') {
      throw new ArgumentError(
        "Malformed filter condition. A filter condition must have a property 'rule' of type 'string'."
      );
    }

    if (condition.rule === 'of-type') {
      const ofTypeCondition = castToOfTypeCondition(condition);
      return this.visitOfTypeCondition(ofTypeCondition);
    }

    if (condition.rule === 'match-property') {
      const matchPropertyCondition = castToMatchPropertyCondition(condition);
      return this.visitMatchPropertyCondition(matchPropertyCondition);
    }

    if (condition.rule === 'all') {
      const matchAllCondition = castToMatchAllCondition(condition);
      return this.visitMatchAllCondition(matchAllCondition);
    }

    if (condition.rule === 'any') {
      const matchAnyCondition = castToMatchAnyCondition(condition);
      return this.visitMatchAnyCondition(matchAnyCondition);
    }

    return condition;
  }

  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    return condition;
  }

  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    return condition;
  }

  protected visitMatchAllCondition(
    condition: MatchAllCondition
  ): FilterCondition {
    return MatchAllCondition(...condition.filters.map((c) => this.visit(c)));
  }

  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    return MatchAnyCondition(...condition.filters.map((c) => this.visit(c)));
  }
}
