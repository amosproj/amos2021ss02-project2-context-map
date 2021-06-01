import {
  FilterCondition,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';
import { QueryParams, allocateQueryParamName } from '../utils';

/**
 * Represents a translated filter condition.
 */
export interface FilterConditionBuildResult {
  /**
   * The translated filter condition in the language of the database, or null if no condition is
   * specified (query-all)
   */
  condition: string | null;
  /**
   * The database query parameters (key-value pairs), that are used in the translated
   * filter condition.
   */
  queryParams: QueryParams;
}

/**
 * Constructs a filter condition build result.
 * @param condition The translated filter condition in the language of the database,
 * or null if no condition is specified (query-all).
 * @param queryParams The database query parameters (key-value pairs), that are used in the translated
 * filter condition.
 * @returns The constructed filter condition build result
 */
export function FilterConditionBuildResult(
  condition: string | null = null,
  queryParams: QueryParams = {}
): FilterConditionBuildResult {
  return { condition, queryParams };
}

/**
 * Represents a filter condition builder that builds cypher filter conditions.
 */
export default class FilterConditionBuilder extends FilterConditionVisitor {
  /* eslint-disable lines-between-class-members */
  private readonly entity: 'node' | 'edge';
  private readonly name: string;
  private resultCondition: string | null = null;
  private queryParams: QueryParams = {};
  /* eslint-enable lines-between-class-members */

  private constructor(entity: 'node' | 'edge', name: string) {
    super();
    this.entity = entity;
    this.name = name;
  }

  /**
   * Builds the cypher filter condition for the specified condition.
   * @param entity The type of entity that the condition filters.
   * @param name The name of a single entity in the resulting cypher query.
   * @param filter The filter condition to translate.
   * @returns An object the represents the translated filter query.
   */
  public static buildFilterCondition(
    entity: 'node' | 'edge',
    name: string,
    filter?: FilterCondition
  ): FilterConditionBuildResult {
    if (filter === undefined) {
      return FilterConditionBuildResult();
    }

    const conditionBuilder = new FilterConditionBuilder(entity, name);
    return conditionBuilder.buildConditionCore(filter);
  }

  private buildConditionCore(
    filter: FilterCondition
  ): FilterConditionBuildResult {
    this.visit(filter);
    return FilterConditionBuildResult(this.resultCondition, this.queryParams);
  }

  /**
   * Translates an of-type condition.
   */
  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    const { type } = condition;
    // The general scheme is the following:
    // for nodes: ${param} in labels(n)
    // for edges: ${param} = type(e)

    // First, we need to allocate a query parameter name
    const paramName = allocateQueryParamName(this.queryParams, type);

    // Construct the result condition
    if (this.entity === 'node') {
      this.resultCondition = `$${paramName} in labels(${this.name})`;
    } else {
      this.resultCondition = `$${paramName} = type(${this.name})`;
    }

    // Write the name of the type to the query parameters.
    // This looks like the following (with type = Person): { Person: 'Person' }
    this.queryParams[paramName] = type;

    return super.visitOfTypeCondition(condition);
  }

  /**
   * Translates a match-property condition.
   */
  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    const { property, value } = condition;
    // The general scheme is the following:
    // n[$property] = $value

    // First, we need to allocate a query parameter name for the property name and
    // one for the property value
    const propertyParamName = allocateQueryParamName(
      this.queryParams,
      property
    );
    const valueParamName = allocateQueryParamName(
      this.queryParams,
      `${property}_value`
    );

    // Construct the result condition
    this.resultCondition = `${this.name}[$${propertyParamName}] = $${valueParamName}`;

    // Write the name of the type to the query parameters.
    // This looks like the following (with property = name and value = Peter):
    // { name: 'name', name_value: 'Peter' }
    this.queryParams[propertyParamName] = property;
    this.queryParams[valueParamName] = value;

    return super.visitMatchPropertyCondition(condition);
  }

  /**
   * Translates a match-all condition.
   */
  protected visitMatchAllCondition(
    condition: MatchAllCondition
  ): FilterCondition {
    const conditions: string[] = [];
    const filters: FilterCondition[] = [];

    // This basically calls visit for all contained filters,
    // captures the result condition of each and afterwards combines them.

    // Clear the result condition.
    this.resultCondition = null;

    // Walk all filters contained in the match-all condition.
    // eslint-disable-next-line no-restricted-syntax
    for (const filter of condition.filters) {
      // Visit the filter and put the result into a collection.
      filters.push(this.visit(filter));

      // If the visit of the filter wrote a result condition, process it.
      if (this.resultCondition !== null) {
        // Add the result condition of the filter to the conditions collection.
        conditions.push(this.resultCondition);

        // Clear the result condition.
        this.resultCondition = null;
      }
    }

    // If there are any translated filters recorded, combine them via AND clause,
    // otherwise we have no translated filter condition.
    if (conditions.length === 0) {
      this.resultCondition = null;
    } else {
      this.resultCondition = `(${conditions.join(' AND ')})`;
    }

    return MatchAllCondition(...filters);
  }

  /**
   * Translates a match-any condition.
   */
  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    const conditions: string[] = [];
    const filters: FilterCondition[] = [];

    // This basically calls visit for all contained filters,
    // captures the result condition of each and afterwards combines them.

    // Walk all filters contained in the match-all condition.
    // Clear the result condition.
    this.resultCondition = null;

    // Walk all filters contained in the match-all condition.
    // eslint-disable-next-line no-restricted-syntax
    for (const filter of condition.filters) {
      // Visit the filter and put the result into a collection.
      filters.push(this.visit(filter));

      // If the visit of the filter wrote a result condition, process it.
      if (this.resultCondition !== null) {
        // Add the result condition of the filter to the conditions collection.
        conditions.push(this.resultCondition);

        // Clear the result condition.
        this.resultCondition = null;
      }
    }

    // If there are any translated filters recorded, combine them via OR clause,
    // otherwise we have no translated filter condition.
    if (conditions.length === 0) {
      this.resultCondition = null;
    } else {
      this.resultCondition = `(${conditions.join(' OR ')})`;
    }

    return MatchAnyCondition(...filters);
  }
}
