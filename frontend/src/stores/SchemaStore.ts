import { inject } from 'inversify';
import { forkJoin, Observable } from 'rxjs';
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
  @inject(SchemaService)
  private readonly schemaService!: SchemaService;

  @inject(ErrorStore)
  private readonly errorStore!: ErrorStore;

  @inject(LoadingStore)
  private readonly loadingStore!: LoadingStore;

  private initializedInternal = false;

  public get initialized(): boolean {
    return this.initializedInternal;
  }

  protected getInitialValue(): Schema {
    return { nodeTypes: [], edgeTypes: [] };
  }

  public update(): void {
    this.initializedInternal = true;
    this.executeQuery().subscribe({
      next: (res) => {
        if (res) {
          this.setState(res);
        }
      },
      error: () => {
        this.setState(this.getInitialValue());
      },
    });
  }

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
