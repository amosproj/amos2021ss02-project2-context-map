import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Subscription } from 'rxjs';
import { EntityStyleProvider } from './EntityStyleProvider';
import SimpleStore from '../SimpleStore';
import { EntityStyleStateStore } from './EntityStyleStateStore';

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export class EntityStyleMonitor extends SimpleStore<EntityStyleProvider> {
  private entityStyleStoreSubscription?: Subscription;

  @inject(EntityStyleStateStore)
  private readonly entityStyleStore!: EntityStyleStateStore;

  @inject(EntityStyleProvider)
  private readonly entityStyleProvider!: EntityStyleProvider;

  protected getInitialValue(): EntityStyleProvider {
    return this.entityStyleProvider;
  }

  protected ensureInit(): void {
    if (this.entityStyleStoreSubscription == null) {
      this.entityStyleStoreSubscription = this.subscribeEntityStyleStore();
    }
  }

  private subscribeEntityStyleStore(): Subscription {
    return this.entityStyleStore.getState().subscribe({
      next: () =>
        this.entityStyleStoreSubscription != null &&
        this.setState(this.entityStyleProvider),
    });
  }
}

export default EntityStyleMonitor;
