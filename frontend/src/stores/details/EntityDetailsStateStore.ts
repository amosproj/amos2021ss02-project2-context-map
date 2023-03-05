import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Subscription } from 'rxjs';
import SimpleStore from '../SimpleStore';
import { EntityDetailsState } from './EntityDetailsState';
import { RoutingStateStore } from '../routing/RoutingStateStore';
import SearchSelectionStore from '../SearchSelectionStore';
import QueryResultStore from '../QueryResultStore';

@injectable()
export class EntityDetailsStateStore extends SimpleStore<EntityDetailsState> {
  private routingStateStoreSubscription?: Subscription;
  private searchSelectionStoreSubscription?: Subscription;
  private queryResultStoreSubscription?: Subscription;

  protected getInitialValue(): EntityDetailsState {
    return { node: null, edge: null };
  }

  @inject(RoutingStateStore)
  private readonly routingStateStore!: RoutingStateStore;

  @inject(SearchSelectionStore)
  private readonly searchSelectionStore!: SearchSelectionStore;

  @inject(QueryResultStore)
  private readonly queryResultStore!: QueryResultStore;

  public clear(): void {
    this.setState(this.getInitialValue());
  }

  public showNode(node: number): void {
    this.mergeState({ node, edge: null });
  }

  public showEdge(edge: number): void {
    this.mergeState({ node: null, edge });
  }

  protected ensureInit(): void {
    if (this.routingStateStoreSubscription == null) {
      this.routingStateStoreSubscription = this.subscribeToRoutingStateStore();
    }

    if (this.searchSelectionStoreSubscription == null) {
      this.searchSelectionStoreSubscription =
        this.subscribeToSearchSelectionStore();
    }

    if (this.queryResultStoreSubscription == null) {
      this.queryResultStoreSubscription = this.subscribeQueryResultStore();
    }
  }

  private subscribeToRoutingStateStore(): Subscription {
    return this.routingStateStore.getState().subscribe({
      next: () => this.clear(),
    });
  }

  private subscribeToSearchSelectionStore(): Subscription {
    return this.searchSelectionStore.getState(true).subscribe({
      next: (selectedSearchResult) => {
        if (selectedSearchResult) {
          if (selectedSearchResult.interfaceType === 'NodeDescriptor') {
            this.showNode(selectedSearchResult.id);
          } else if (selectedSearchResult.interfaceType === 'EdgeDescriptor') {
            this.showEdge(selectedSearchResult.id);
          } else {
            this.clear();
          }
        } else {
          this.clear();
        }
      },
    });
  }

  private subscribeQueryResultStore(): Subscription {
    return this.queryResultStore.getState().subscribe({
      next: (queryResult) => {
        const state = this.getValue();
        // If the current selection is a node
        if (state.node !== null) {
          // If the node is not part of the query-result
          if (!queryResult.nodes.some((node) => node.id === state.node)) {
            this.clear();
          }
          // If the current selection is an edge
        } else if (state.edge !== null) {
          // If the edge is not part of the query-result
          if (!queryResult.edges.some((edge) => edge.id === state.edge)) {
            this.clear();
          }
        }
      },
    });
  }
}

export default EntityDetailsStateStore;
