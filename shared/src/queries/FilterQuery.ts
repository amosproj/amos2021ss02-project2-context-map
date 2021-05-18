import { Property } from '../entities/Property';
import QueryBase from './QueryBase';

export interface FilterCondition {
  condition: string;
}

export interface OfTypeCondition extends FilterCondition {
  condition: 'of-type';
  entity: 'node' | 'edge';
  type: string;
}

export function OfTypeCondition(
  entity: 'node' | 'edge',
  type: string
): OfTypeCondition {
  return { condition: 'of-type', entity, type };
}

export interface MatchPropertyCondition extends FilterCondition {
  condition: 'match-property';
  property: string;
  value: Property;
}

export function MatchPropertyCondition(
  property: string,
  value: Property
): MatchPropertyCondition {
  return { condition: 'match-property', property, value };
}

export interface MatchAllCondition extends FilterCondition {
  condition: 'all';
  filters: FilterCondition[];
}

export function MatchAllCondition(
  ...filters: FilterCondition[]
): MatchAllCondition {
  return { condition: 'all', filters };
}

export interface MatchAnyCondition extends FilterCondition {
  condition: 'any';
  filters: FilterCondition[];
}

export function MatchAnyCondition(
  ...filters: FilterCondition[]
): MatchAnyCondition {
  return { condition: 'any', filters };
}

export default interface FilterQuery extends QueryBase {
  filter?: FilterCondition;
}
