import FilterQuery from './FilterQuery';

export interface ShortestPathQuery extends FilterQuery {
  startNode: number;
  endNode: number;
  ignoreEdgeDirections?: boolean;
}
