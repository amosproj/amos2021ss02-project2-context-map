import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { QueryService } from '../../services/query';
import withErrorHandler from '../../utils/withErrorHandler';
import withLoadingBar from '../../utils/withLoadingBar';
import ErrorStore from '../ErrorStore';
import LoadingStore from '../LoadingStore';
import SimpleStore from '../SimpleStore';
import { EdgeDetails } from './EdgeDetails';
import { EntityDetailsState } from './EntityDetailsState';
import { EntityDetailsStateStore } from './EntityDetailsStateStore';
import { NodeDetails } from './NodeDetails';

type EntityDetails = NodeDetails | EdgeDetails;

@injectable()
export class EntityDetailsStore extends SimpleStore<EntityDetails | null> {
  private stateStoreSubscription?: Subscription;

  protected getInitialValue(): EntityDetails | null {
    return null;
  }

  @inject(EntityDetailsStateStore)
  private readonly stateStore!: EntityDetailsStateStore;

  @inject(QueryService)
  private readonly queryService!: QueryService;

  @inject(ErrorStore)
  private readonly errorStore!: ErrorStore;

  @inject(LoadingStore)
  private readonly loadingStore!: LoadingStore;

  protected ensureInit(): void {
    if (this.stateStoreSubscription == null) {
      this.stateStoreSubscription = this.subscribeToStateStore();
    }
  }

  private subscribeToStateStore(): Subscription {
    return this.stateStore.getState().subscribe({
      next: (state) => this.update(state),
    });
  }

  private update(state: EntityDetailsState): void {
    if (state.node !== null) {
      this.queryService
        .getNodeById(state.node)
        .pipe(
          take(1), // TODO: Why is this necessary??
          withLoadingBar({ loadingStore: this.loadingStore }),
          withErrorHandler({ rethrow: true, errorStore: this.errorStore })
        )
        .subscribe({
          next: (res) => this.setState(NodeDetails(res)),
          error: () => this.setState(null),
        });
    } else if (state.edge !== null) {
      this.queryService
        .getEdgeById(state.edge)
        .pipe(
          take(1), // TODO: Why is this necessary??
          withLoadingBar({ loadingStore: this.loadingStore }),
          withErrorHandler({ rethrow: true, errorStore: this.errorStore })
        )
        .subscribe({
          next: (res) => this.setState(EdgeDetails(res)),
          error: () => this.setState(null),
        });
    } else {
      this.setState(null);
    }
  }
}

export default EntityDetailsStore;
