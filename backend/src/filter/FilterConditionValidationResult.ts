/**
 * The result of a filter condition validation.
 */
export interface FilterConditionValidationResult {
  /**
   * The invalid property of the filter condition
   * or undefined if the filter condition is valid.
   */
  invalidProperty?: string;

  /**
   * The property type that is expected for the filter condition property
   * or undefined of the property was missing in the filter condition instance.
   */
  type?: string;
}
