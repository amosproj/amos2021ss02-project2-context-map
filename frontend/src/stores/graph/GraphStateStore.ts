import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Subscription } from 'rxjs';
import { GraphData } from 'react-graph-vis';
import { uuid } from 'uuidv4';
import { deepEqual } from 'fast-equals';
import SimpleStore from '../SimpleStore';
import QueryResultStore, { QueryResultMeta } from '../QueryResultStore';
import EntityStyleStore from '../colors/EntityStyleStore';
import convertQueryResult from '../../visualization/shared-ops/convertQueryResult';
import { EntityStyleProvider } from '../colors';
import { QueryResult } from '../../shared/queries';

export type UUID = string;

export interface GraphState {
  graph: GraphData;
  key: UUID;
  /**
   * If undefined: no shortest path queried.
   * If false: shortest path queried but is not in result
   * If true: shortest path queried and is in result.
   */
  containsShortestPath?: boolean;
}

@injectable()
export class GraphStateStore extends SimpleStore<GraphState> {
  protected getInitialValue(): GraphState {
    return {
      graph: {
        nodes: [],
        edges: [],
      },
      key: uuid(),
      containsShortestPath: false,
    };
  }

  private queryResultStoreSubscription?: Subscription;
  private entityStyleStoreSubscription?: Subscription;

  @inject(QueryResultStore)
  private readonly queryResultStore!: QueryResultStore;

  @inject(EntityStyleStore)
  private readonly entityStyleStore!: EntityStyleStore;

  protected ensureInit(): void {
    if (this.queryResultStoreSubscription == null) {
      this.queryResultStoreSubscription = this.subscribeQueryResultStore();
    }

    if (this.entityStyleStoreSubscription == null) {
      this.entityStyleStoreSubscription = this.subscribeEntityStyleStore();
    }
  }

  subscribeQueryResultStore(): Subscription {
    return this.queryResultStore.getState().subscribe({
      next: (queryResult) =>
        this.update(queryResult, this.entityStyleStore.getValue()),
    });
  }

  subscribeEntityStyleStore(): Subscription {
    return this.entityStyleStore.getState().subscribe({
      next: (styleProvider) =>
        this.update(this.queryResultStore.getValue(), styleProvider),
    });
  }

  update(
    queryResult: QueryResult & QueryResultMeta,
    styleProvider: EntityStyleProvider
  ): void {
    const currentState = this.getValue();
    const graph = convertQueryResult(queryResult, styleProvider);
    const { containsShortestPath } = queryResult;
    const updatedState = {
      graph,
      containsShortestPath,
      key: uuid(),
    };

    // TODO: Do we need to update the render-token if containsShortestPath changed?
    if (deepEqual(graph, currentState.graph)) {
      // Make sure that the object are the same instance such that
      // the graph-vis library does not update the graph component.
      updatedState.graph = currentState.graph;
      updatedState.key = currentState.key;
    }

    this.setState(updatedState);
  }
}

export default GraphStateStore;
