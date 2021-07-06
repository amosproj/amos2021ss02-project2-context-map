/* istanbul ignore file */
import { inject, injectable } from 'inversify';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import SimpleStore from '../SimpleStore';
import { FilterLineState, FilterState } from './FilterState';
import SchemaStore, { Schema } from '../SchemaStore';

/**
 * Contains the current state of the filter. Note that the underlying {@link FilterState} contains
 * methods that only change a copy of the underlying {@link FilterState}. To change the state of this
 * store, {@link FilterStateStore.setState} has to be called with the new {@link FilterState},
 * or {@link transformState} has to be used.
 */
@injectable()
export default class FilterStateStore extends SimpleStore<FilterState> {
  private schemaStoreSubscription?: Subscription;

  @inject(SchemaStore)
  private schemaStore!: SchemaStore;

  protected getInitialValue(): FilterState {
    return new FilterState([], []);
  }

  protected ensureInit(): void {
    if (this.schemaStoreSubscription == null) {
      this.schemaStoreSubscription = this.subscribeToSchemaStore();
    }
  }

  public getValue(): FilterState {
    const json = super.getValue();
    return new FilterState(json.edges, json.nodes);
  }

  public getState(): Observable<FilterState> {
    return super
      .getState()
      .pipe(map((next) => new FilterState(next.edges, next.nodes)));
  }

  /**
   * Transforms the current state of the store by applying transform it.
   * @param transform - function to be applied on the current state of the store.
   */
  public transformState(
    transform: (arg: FilterState) => FilterState | void
  ): void {
    const localValue = this.getValue();
    const transformed = transform(localValue);
    const transformedState =
      transformed instanceof Object ? transformed : localValue;
    this.setState(transformedState);
  }

  /**
   * @override
   */
  public reset(): void {
    this.initFromSchema(this.schemaStore.getValue());
  }

  /**
   * Initializes the {@link FilterState} with unactive {@link FilterLineState}s with types
   * from schema.
   * @param schema - the schema that is used for initialization of the {@link FilterLineState} types.
   * @private
   */
  private initFromSchema(schema: Schema): void {
    const nodeLineStates: FilterLineState[] = [];
    const edgeLineStates: FilterLineState[] = [];

    for (const nodeTypes of schema.nodeTypes) {
      nodeLineStates.push({
        type: nodeTypes.name,
        isActive: false,
        propertyFilters: [],
      });
    }

    for (const edgeTypes of schema.edgeTypes) {
      edgeLineStates.push({
        type: edgeTypes.name,
        isActive: false,
        propertyFilters: [],
      });
    }

    this.storeSubject.next(new FilterState(edgeLineStates, nodeLineStates));
  }

  /**
   * Subscribes to the state of the {@link schemaStore} so that the state
   * of this store is updated when the {@link schemaStore} updates.
   * @returns subscription of the {@link schemaStore} state
   * @private
   */
  private subscribeToSchemaStore(): Subscription {
    // If the schema changes, the filter state will be updated automatically
    return this.schemaStore.getState().subscribe({
      next: (schema) => this.initFromSchema(schema),
    });
  }
}
