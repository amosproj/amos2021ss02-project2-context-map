import { ArgumentError } from '../shared/errors';
import {
  FilterCondition,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';

/**
 * The type-names of all known filter conditions.
 */
type KnownFilterConditions =
  | 'OfTypeCondition'
  | 'MatchPropertyCondition'
  | 'MatchAllCondition'
  | 'MatchAnyCondition';

/**
 * Formats an error message that describes a malformed filter condition.
 * @param filter The filter condition name.
 * @param property The property of the filter condition that is malformed.
 * @param type The expected type of the filter condition property or `undefined` if the property was missing but expected.
 * @returns The formatted error message.
 */
function formatMalformedConditionMessage(
  filter: KnownFilterConditions,
  property: string,
  type?: string
): string {
  if (type) {
    return `Malformed filter condition. A filter condition of type '${filter}' must have a property '${property}' of type '${type}'.`;
  }

  return `Malformed filter condition. A filter condition of type '${filter}' must have a property '${property}'.`;
}

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

    // Check for the condition type and branch accordingly. For the specific types, check whether they are
    // well-formed and throw an exception if they are not. This is done in the dedicated visit methods
    // with `Checked` postfix.
    if (condition.rule === 'of-type') {
      const ofTypeCondition = <OfTypeCondition>condition;
      return this.visitOfTypeConditionChecked(ofTypeCondition);
    }

    if (condition.rule === 'match-property') {
      const matchPropertyCondition = <MatchPropertyCondition>condition;
      return this.visitMatchPropertyConditionChecked(matchPropertyCondition);
    }

    if (condition.rule === 'all') {
      const matchAllCondition = <MatchAllCondition>condition;
      return this.visitMatchAllConditionChecked(matchAllCondition);
    }

    if (condition.rule === 'any') {
      const matchAnyCondition = <MatchAnyCondition>condition;
      return this.visitMatchAnyConditionChecked(matchAnyCondition);
    }

    // The condition specified is unknown.
    throw new ArgumentError(
      `Malformed filter condition. A filter condition with rule '${condition.rule}' is unknown.`
    );
  }

  /**
   * Checks the specified match-any condition to be well-formed, visits it and returns the transformed condition.
   * @param condition The of-type condition to visit.
   * @returns The transformed condition.
   */
  private visitOfTypeConditionChecked(
    condition: OfTypeCondition
  ): FilterCondition {
    // An of-type condition needs to have a string-typed `type` property.
    if (condition.type === undefined || typeof condition.type !== 'string') {
      throw new ArgumentError(
        formatMalformedConditionMessage('OfTypeCondition', 'type', 'string')
      );
    }

    return this.visitOfTypeCondition(condition);
  }

  /**
   * Visits the specified of-type condition and returns the transformed condition.
   * @param condition The of-type condition to visit.
   * @returns The transformed condition.
   */
  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    return condition;
  }

  /**
   * Checks the specified match-any condition to be well-formed, visits it and returns the transformed condition.
   * @param condition The match-property condition to visit.
   * @returns The transformed condition.
   */
  private visitMatchPropertyConditionChecked(
    condition: MatchPropertyCondition
  ): FilterCondition {
    // A match-property condition must have a string-typed `property` property.
    if (
      condition.property === undefined ||
      typeof condition.property !== 'string'
    ) {
      throw new ArgumentError(
        formatMalformedConditionMessage(
          'MatchPropertyCondition',
          'property',
          'string'
        )
      );
    }

    // // A match-property condition must `value` property.
    if (condition.value === undefined) {
      throw new ArgumentError(
        formatMalformedConditionMessage('MatchPropertyCondition', 'value')
      );
    }

    return this.visitMatchPropertyCondition(condition);
  }

  /**
   * Visits the specified match-property condition and returns the transformed condition.
   * @param condition The match-property condition to visit.
   * @returns The transformed condition.
   */
  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    return condition;
  }

  /**
   * Checks the specified match-any condition to be well-formed, visits it and returns the transformed condition.
   * @param condition The match-all condition to visit.
   * @returns The transformed condition.
   */
  private visitMatchAllConditionChecked(
    condition: MatchAllCondition
  ): FilterCondition {
    // A match-all condition must have a property `filters` that is an array of strings.
    if (condition.filters === undefined || !Array.isArray(condition.filters)) {
      throw new ArgumentError(
        formatMalformedConditionMessage(
          'MatchAllCondition',
          'filters',
          'string[]'
        )
      );
    }

    return this.visitMatchAllCondition(condition);
  }

  /**
   * Visits the specified match-all condition and returns the transformed condition.
   * @param condition The match-all condition to visit.
   * @returns The transformed condition.
   */
  protected visitMatchAllCondition(
    condition: MatchAllCondition
  ): FilterCondition {
    return MatchAllCondition(...condition.filters.map((c) => this.visit(c)));
  }

  /**
   * Checks the specified match-any condition to be well-formed, visits it and returns the transformed condition.
   * @param condition The match-any condition to visit.
   * @returns The transformed condition.
   */
  private visitMatchAnyConditionChecked(
    condition: MatchAnyCondition
  ): FilterCondition {
    // A match-any condition must have a property `filters` that is an array of strings.
    if (condition.filters === undefined || !Array.isArray(condition.filters)) {
      throw new ArgumentError(
        formatMalformedConditionMessage(
          'MatchAnyCondition',
          'filters',
          'string[]'
        )
      );
    }

    return this.visitMatchAnyCondition(condition);
  }

  /**
   * Visits the specified match-any condition and returns the transformed condition.
   * @param condition The match-any condition to visit.
   * @returns The transformed condition.
   */
  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    return MatchAnyCondition(...condition.filters.map((c) => this.visit(c)));
  }
}
