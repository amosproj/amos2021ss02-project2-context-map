import { Property } from '../entities/Property';
import QueryBase from './QueryBase';

export interface FilterCondition {
  rule: string;
}

export interface OfTypeCondition extends FilterCondition {
  rule: 'of-type';
  type: string;
}

export function OfTypeCondition(type: string): OfTypeCondition {
  return { rule: 'of-type', type };
}

export interface MatchPropertyCondition extends FilterCondition {
  rule: 'match-property';
  property: string;
  value: Property;
}

export function MatchPropertyCondition(
  property: string,
  value: Property
): MatchPropertyCondition {
  return { rule: 'match-property', property, value };
}

export interface MatchAllCondition extends FilterCondition {
  rule: 'all';
  filters: FilterCondition[];
}

export function MatchAllCondition(
  ...filters: FilterCondition[]
): MatchAllCondition {
  return { rule: 'all', filters };
}

export interface MatchAnyCondition extends FilterCondition {
  rule: 'any';
  filters: FilterCondition[];
}

export function MatchAnyCondition(
  ...filters: FilterCondition[]
): MatchAnyCondition {
  return { rule: 'any', filters };
}

export default interface FilterQuery extends QueryBase {
  filters?: {
    nodes?: FilterCondition;
    edges?: FilterCondition;
  };
}
