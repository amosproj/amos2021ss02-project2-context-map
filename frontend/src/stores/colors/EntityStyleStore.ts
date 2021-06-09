import 'reflect-metadata';
import { injectable } from 'inversify';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityStyleProvider } from './EntityStyleProvider';
import { EntityStyleProviderImpl } from './EntityStyleProviderImpl';

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export class EntityStyleStore {
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
   * Returns an observable that outputs the stored value.
   */
  public getState(): Observable<EntityStyleProvider> {
    return this.storeSubject.pipe();
  }

  /**
   * Returns the current value of the stored value.
   */
  public getValue(): EntityStyleProvider {
    return this.storeSubject.value;
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
}

export default EntityStyleStore;
