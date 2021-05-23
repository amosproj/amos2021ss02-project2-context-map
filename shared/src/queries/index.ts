import FilterQuery, {
  FilterCondition,
  OfTypeCondition,
  MatchPropertyCondition,
  MatchAllCondition,
  MatchAnyCondition,
} from './FilterQuery';
import NodeResultDescriptor from './NodeResultDescriptor';
import QueryBase from './QueryBase';
import QueryResult from './QueryResult';

export {
  OfTypeCondition,
  MatchPropertyCondition,
  MatchAllCondition,
  MatchAnyCondition,
};

export type {
  FilterQuery,
  FilterCondition,
  NodeResultDescriptor,
  QueryBase,
  QueryResult,
};
