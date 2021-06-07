/* istanbul ignore file */

import FilterQuery, {
  FilterCondition,
  OfTypeCondition,
  MatchPropertyCondition,
  MatchAllCondition,
  MatchAnyCondition,
} from './FilterQuery';
import { QueryEdgeResult } from './QueryEdgeResult';
import QueryNodeResult from './QueryNodeResult';
import QueryBase from './QueryBase';
import QueryResult from './QueryResult';
import CountQueryResult from './CountQueryResult';

export {
  OfTypeCondition,
  MatchPropertyCondition,
  MatchAllCondition,
  MatchAnyCondition,
};

export type {
  FilterQuery,
  FilterCondition,
  QueryEdgeResult,
  QueryNodeResult,
  QueryBase,
  QueryResult,
  CountQueryResult,
};

export type { ShortestPathQuery } from './ShortestPathQuery';
