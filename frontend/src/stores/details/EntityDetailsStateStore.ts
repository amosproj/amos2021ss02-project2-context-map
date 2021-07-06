import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Subscription } from 'rxjs';
import SimpleStore from '../SimpleStore';
import { EntityDetailsState } from './EntityDetailsState';
import { RoutingStateStore } from '../routing/RoutingStateStore';

@injectable()
export class EntityDetailsStateStore extends SimpleStore<EntityDetailsState> {
  private routingStateStoreSubscription?: Subscription;

  protected getInitialValue(): EntityDetailsState {
    return { node: null, edge: null };
  }

  @inject(RoutingStateStore)
  private readonly routingStateStore!: RoutingStateStore;

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
  }

  private subscribeToRoutingStateStore(): Subscription {
    return this.routingStateStore.getState().subscribe({
      next: () => this.clear(),
    });
  }
}

export default EntityDetailsStateStore;
