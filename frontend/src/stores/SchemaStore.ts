import { inject } from 'inversify';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import SimpleStore from './SimpleStore';
import { EdgeType, NodeType } from '../shared/schema';
import { SchemaService } from '../services/schema';
import withLoadingBar from '../utils/withLoadingBar';
import withErrorHandler from '../utils/withErrorHandler';
import ErrorStore from './ErrorStore';
import LoadingStore from './LoadingStore';

export type Schema = { nodeTypes: NodeType[]; edgeTypes: EdgeType[] };

export default class SchemaStore extends SimpleStore<Schema> {
  /**
   * {@link Subscription} to the {@link Observable} that is built in {@link executeQuery}.
   * @private
   */
  private schemaSubscription?: Subscription;

  @inject(SchemaService)
  private readonly schemaService!: SchemaService;

  @inject(ErrorStore)
  private readonly errorStore!: ErrorStore;

  @inject(LoadingStore)
  private readonly loadingStore!: LoadingStore;

  protected getInitialValue(): Schema {
    return { nodeTypes: [], edgeTypes: [] };
  }

  /**
   * @override
   */
  protected ensureInit(): void {
    if (this.schemaSubscription == null) {
      this.schemaSubscription = this.executeQuery().subscribe({
        next: (res) => {
          this.setState(res);
        },
        error: () => {
          this.setState(this.getInitialValue());
        },
      });
    }
  }

  /**
   * Queries the {@link Schema} with the {@link schemaService}.
   * @private
   */
  private executeQuery(): Observable<Schema> {
    return forkJoin([
      this.schemaService.getNodeTypes(),
      this.schemaService.getEdgeTypes(),
    ]).pipe(
      withLoadingBar({ loadingStore: this.loadingStore }),
      withErrorHandler({ errorStore: this.errorStore }),
      map((schemaArray) => ({
        nodeTypes: schemaArray[0],
        edgeTypes: schemaArray[1],
      }))
    );
  }
}
