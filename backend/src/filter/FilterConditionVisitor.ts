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

/**
 * A base type for filter condition visitors, that allow a deep traversal through filter condition trees.
 */
export default abstract class FilterConditionVisitor {
  /**
   * @param condition Visits the specified condition and transforms it to a new condition.
   * @returns The transformed condition.
   */
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

  /**
   * Visits the specified of-type condition and return the transformed condition.
   * @param condition The of-type condition to visit.
   * @returns The transformed condition.
   */
  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    return condition;
  }

  /**
   * Visits the specified match-property condition and return the transformed condition.
   * @param condition The match-property condition to visit.
   * @returns The transformed condition.
   */
  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    return condition;
  }

  /**
   * Visits the specified match-all condition and return the transformed condition.
   * @param condition The match-all condition to visit.
   * @returns The transformed condition.
   */
  protected visitMatchAllCondition(
    condition: MatchAllCondition
  ): FilterCondition {
    return MatchAllCondition(...condition.filters.map((c) => this.visit(c)));
  }

  /**
   * Visits the specified match-any condition and return the transformed condition.
   * @param condition The match-any condition to visit.
   * @returns The transformed condition.
   */
  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    return MatchAnyCondition(...condition.filters.map((c) => this.visit(c)));
  }
}
