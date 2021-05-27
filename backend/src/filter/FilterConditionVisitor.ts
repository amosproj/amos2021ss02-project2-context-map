import { ArgumentError } from '../shared/errors';
import {
  FilterCondition,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import { validateMatchAllCondition } from './validateMatchAllCondition';
import { validateMatchAnyCondition } from './validateMatchAnyCondition';
import { validateMatchPropertyCondition } from './validateMatchPropertyCondition';
import { validateOfTypeCondition } from './validateOfTypeCondition';

export default abstract class FilterConditionVisitor {
  protected visit(condition: FilterCondition): FilterCondition {
    if (condition.rule === undefined || typeof condition.rule !== 'string') {
      throw new ArgumentError(
        "Malformed filter condition. A filter condition must have a property 'rule' of type 'string'."
      );
    }

    if (condition.rule === 'of-type') {
      const ofTypeCondition = validateOfTypeCondition(condition);
      return this.visitOfTypeCondition(ofTypeCondition);
    }

    if (condition.rule === 'match-property') {
      const matchPropertyCondition = validateMatchPropertyCondition(condition);
      return this.visitMatchPropertyCondition(matchPropertyCondition);
    }

    if (condition.rule === 'all') {
      const matchAllCondition = validateMatchAllCondition(condition);
      return this.visitMatchAllCondition(matchAllCondition);
    }

    if (condition.rule === 'any') {
      const matchAnyCondition = validateMatchAnyCondition(condition);
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
