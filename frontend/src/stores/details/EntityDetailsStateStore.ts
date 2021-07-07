import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Subscription } from 'rxjs';
import SimpleStore from '../SimpleStore';
import { EntityDetailsState } from './EntityDetailsState';
import { RoutingStateStore } from '../routing/RoutingStateStore';
import SearchSelectionStore from '../SearchSelectionStore';

@injectable()
export class EntityDetailsStateStore extends SimpleStore<EntityDetailsState> {
  private routingStateStoreSubscription?: Subscription;
  private searchSelectionStoreSubscription?: Subscription;

  protected getInitialValue(): EntityDetailsState {
    return { node: null, edge: null };
  }

  @inject(RoutingStateStore)
  private readonly routingStateStore!: RoutingStateStore;

  @inject(SearchSelectionStore)
  private readonly searchSelectionStore!: SearchSelectionStore;

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
  }

  private subscribeToRoutingStateStore(): Subscription {
    return this.routingStateStore.getState().subscribe({
      next: () => this.clear(),
    });
  }

  private subscribeToSearchSelectionStore(): Subscription {
    return this.searchSelectionStore.getState().subscribe({
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
}

export default EntityDetailsStateStore;
