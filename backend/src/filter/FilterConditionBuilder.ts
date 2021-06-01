import {
  FilterCondition,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';
import { QueryParams, allocateQueryParamName } from '../utils/QueryParams';

export interface FilterConditionBuildResult {
  condition: string | null;
  queryParams: QueryParams;
}

export function FilterConditionBuildResult(
  condition: string | null = null,
  queryParams: QueryParams = {}
): FilterConditionBuildResult {
  return { condition, queryParams };
}

export default class FilterConditionBuilder extends FilterConditionVisitor {
  /* eslint-disable lines-between-class-members */
  private readonly entity: 'node' | 'edge';
  private readonly name: string;
  private resultCondition: string | null = null;
  private queryParams: QueryParams = {};
  /* eslint-enable lines-between-class-members */

  public constructor(entity: 'node' | 'edge', name: string) {
    super();
    this.entity = entity;
    this.name = name;
  }

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

  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    const { type } = condition;
    const paramName = allocateQueryParamName(this.queryParams, type);

    if (this.entity === 'node') {
      this.resultCondition = `$${paramName} in labels(${this.name})`;
    } else {
      this.resultCondition = `$${paramName} = type(${this.name})`;
    }

    this.queryParams[paramName] = type;

    return super.visitOfTypeCondition(condition);
  }

  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    const { property, value } = condition;
    const propertyParamName = allocateQueryParamName(
      this.queryParams,
      property
    );
    const valueParamName = allocateQueryParamName(
      this.queryParams,
      `${property}_value`
    );

    this.resultCondition = `${this.name}[$${propertyParamName}] = $${valueParamName}`;

    this.queryParams[propertyParamName] = property;
    this.queryParams[valueParamName] = value;

    return super.visitMatchPropertyCondition(condition);
  }

  protected visitMatchAllCondition(
    condition: MatchAllCondition
  ): FilterCondition {
    const conditions: string[] = [];
    const filters: FilterCondition[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const filter of condition.filters) {
      filters.push(this.visit(filter));
      if (this.resultCondition !== null) {
        conditions.push(this.resultCondition);
        this.resultCondition = null;
      }
    }

    if (conditions.length === 0) {
      this.resultCondition = null;
    } else {
      this.resultCondition = `(${conditions.join(' AND ')})`;
    }

    return MatchAllCondition(...filters);
  }

  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    const conditions: string[] = [];
    const filters: FilterCondition[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const filter of condition.filters) {
      filters.push(this.visit(filter));
      if (this.resultCondition !== null) {
        conditions.push(this.resultCondition);
        this.resultCondition = null;
      }
    }

    if (conditions.length === 0) {
      this.resultCondition = null;
    } else {
      this.resultCondition = `(${conditions.join(' OR ')})`;
    }

    return MatchAnyCondition(...filters);
  }
}
