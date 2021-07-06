import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { EntityStyleProvider } from './EntityStyleProvider';
import { EntityStyleProviderImpl } from './EntityStyleProviderImpl';
import SearchSelectionStore, {
  SelectedSearchResult,
} from '../SearchSelectionStore';
import { ArgumentError } from '../../shared/errors';

export type SelectionInfo =
  | { kind: 'NODE' | 'EDGE'; id: number }
  | { kind: 'NODE' | 'EDGE'; type: string };

/**
 * Converts a {@link SelectedSearchResult} to a {@link SelectionInfo}
 * @param selectionResult - {@link SelectedSearchResult} that is converted
 */
export function createSelectionInfo(
  selectionResult?: SelectedSearchResult
): SelectionInfo | undefined {
  if (selectionResult === undefined) return undefined;

  switch (selectionResult.interfaceType) {
    case 'EdgeDescriptor':
      return { kind: 'EDGE', id: selectionResult.id };
    case 'NodeDescriptor':
      return { kind: 'NODE', id: selectionResult.id };
    case 'EdgeTypeDescriptor':
      return { kind: 'EDGE', type: selectionResult.name };
    case 'NodeTypeDescriptor':
      return { kind: 'NODE', type: selectionResult.name };
    /* istanbul ignore next */
    default:
      throw new ArgumentError(`Unknown selection`);
  }
}

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export class EntityStyleStore {
  private searchSelectionStoreSubscription?: Subscription;

  constructor(
    @inject(SearchSelectionStore)
    private readonly searchSelectionStore: SearchSelectionStore
  ) {}

  /**
   * Contains the state.
   * Returns the current state immediately after subscribing.
   * @protected
   */
  protected readonly storeSubject = new BehaviorSubject<EntityStyleProvider>(
    this.getEntityColorizer()
  );

  /**
   * Contains information about the current selected entity.
   * @private
   */
  private entitySelectionInfo?: SelectionInfo;

  public getEntitySelectionInfo(): SelectionInfo | undefined {
    return this.entitySelectionInfo;
  }

  /**
   * Returns the entity colorizing function.
   * @protected
   */
  protected getEntityColorizer(): EntityStyleProvider {
    return new EntityStyleProviderImpl(this);
  }

  /* istanbul ignore next */
  /**
   * Returns an observable that outputs the stored value.
   */
  public getState(): Observable<EntityStyleProvider> {
    this.ensureInit();
    return this.storeSubject.pipe();
  }

  /**
   * Returns the current value of the stored value.
   */
  public getValue(): EntityStyleProvider {
    this.ensureInit();
    return this.storeSubject.value;
  }

  protected ensureInit(): void {
    if (this.searchSelectionStoreSubscription == null) {
      this.searchSelectionStoreSubscription =
        this.subscribeToSearchSelectionStore();
    }
  }

  private readonly greyScaleEdges = new BehaviorSubject<boolean>(false);

  /* istanbul ignore next */
  /**
   * Getter for greyScaleEdges property
   * @returns An Observable holding a boolean determining whether edges should be in greyscale or colored
   */
  public getGreyScaleEdges(): Observable<boolean> {
    return this.greyScaleEdges.pipe();
  }

  public getGreyScaleEdgesValue(): boolean {
    return this.greyScaleEdges.value;
  }

  public setGreyScaleEdges(greyScale: boolean): void {
    this.greyScaleEdges.next(greyScale);
    this.storeSubject.next(this.getEntityColorizer());
  }

  /**
   * Updates the store using a {@link SelectedSearchResult}
   * @param selectionResult - the {@link SelectedSearchResult} that is used for updating
   * @private
   */
  private nextSelectionResult(selectionResult?: SelectedSearchResult) {
    this.entitySelectionInfo = createSelectionInfo(selectionResult);
    this.storeSubject.next(this.getEntityColorizer());
  }

  /**
   * Subscribes to the state of the {@link searchSelectionStore} so that the state
   * of this store is updated when the {@link searchSelectionStore} updates.
   * @returns subscription of the {@link searchSelectionStore} state
   * @private
   */
  private subscribeToSearchSelectionStore(): Subscription {
    return this.searchSelectionStore.getState(true).subscribe({
      next: (selectionResult) => this.nextSelectionResult(selectionResult),
    });
  }
}

export default EntityStyleStore;
