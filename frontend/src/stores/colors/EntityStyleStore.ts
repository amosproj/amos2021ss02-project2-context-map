import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { EntityStyleProvider } from './EntityStyleProvider';
import { EntityStyleProviderImpl } from './EntityStyleProviderImpl';
import SearchSelectionStore, {
  isEdgeDescriptor,
  isEdgeTypeDescriptor,
  isNodeDescriptor,
  isNodeTypeDescriptor,
  SelectedSearchResult,
} from '../SearchSelectionStore';
import { EdgeTypeDescriptor, NodeTypeDescriptor } from '../../shared/schema';

export type SelectionInfo =
  | { kind: 'NODE' | 'EDGE'; id: number }
  | { kind: 'NODE' | 'EDGE'; type: string };

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export class EntityStyleStore {
  private searchSelectionStoreSubscription?: Subscription;

  @inject(SearchSelectionStore)
  private readonly searchSelectionStore!: SearchSelectionStore;

  /**
   * Contains the state.
   * Returns the current state immediately after subscribing.
   * @protected
   */
  protected readonly storeSubject = new BehaviorSubject<EntityStyleProvider>(
    this.getEntityColorizer()
  );

  /**
   * Returns the entity colorizing function.
   * @protected
   */
  protected getEntityColorizer(): EntityStyleProvider {
    return new EntityStyleProviderImpl(this);
  }
  /**
   * Updates the current filter by replacing it completely.
   */
  public setState(newState: EntityStyleProvider): void {
    this.storeSubject.next(newState);
  }

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
    return this.storeSubject.value;
  }

  protected ensureInit(): void {
    if (this.searchSelectionStoreSubscription == null) {
      this.searchSelectionStoreSubscription =
        this.subscribeToSearchSelectionStore();
    }
  }

  private readonly greyScaleEdges = new BehaviorSubject<boolean>(false);

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

  private entitySelection!: SelectionInfo;

  /**
   * An adapted {@link SelectedSearchResult} that is used in the {@link EntityStyleProvider}.
   */
  public getEntitySelection(): SelectionInfo {
    return this.entitySelection;
  }

  /**
   * Updates the store using a {@link SelectedSearchResult}
   * @param selectionResult - the {@link SelectedSearchResult} that is used for updating
   * @private
   */
  private update(selectionResult: SelectedSearchResult) {
    const entitySelection = this.convertToSelectionInfo(selectionResult);

    if (entitySelection !== undefined) {
      this.entitySelection = entitySelection;
    }

    this.setState(this.getValue());
  }

  /**
   * Converts a {@link SelectedSearchResult} to a {@link SelectionInfo}
   * @param selectionResult - {@link SelectedSearchResult} that is converted
   * @private
   */
  private convertToSelectionInfo(
    selectionResult: SelectedSearchResult
  ): SelectionInfo | undefined {
    let entitySelection: SelectionInfo | undefined;
    if (isNodeDescriptor(selectionResult)) {
      entitySelection = { kind: 'NODE', id: selectionResult.id };
    } else if (isEdgeDescriptor(selectionResult)) {
      entitySelection = { kind: 'EDGE', id: selectionResult.id };
    } else if (isEdgeTypeDescriptor(selectionResult)) {
      entitySelection = {
        kind: 'EDGE',
        type: (selectionResult as EdgeTypeDescriptor).name,
      };
    } else if (isNodeTypeDescriptor(selectionResult)) {
      entitySelection = {
        kind: 'NODE',
        type: (selectionResult as NodeTypeDescriptor).name,
      };
    }

    return entitySelection;
  }

  /**
   * Subscribes to the state of the {@link searchSelectionStore} so that the state
   * of this store is updated when the {@link searchSelectionStore} updates.
   * @returns subscription of the {@link searchSelectionStore} state
   * @private
   */
  private subscribeToSearchSelectionStore(): Subscription {
    return this.searchSelectionStore.getState().subscribe({
      next: (selectionResult) => this.update(selectionResult),
    });
  }
}

export default EntityStyleStore;
