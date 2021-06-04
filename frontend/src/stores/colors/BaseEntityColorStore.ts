/* istanbul ignore file */

import 'reflect-metadata';
import { injectable } from 'inversify';
import { BehaviorSubject, Observable } from 'rxjs';
import EntityVisualisationAttributes from './EntityVisualisationAttributes';
import getNthColor from './getNthColor';

type EntityConverter<T> = (type: T) => EntityVisualisationAttributes;

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export default abstract class BaseEntityColorStore<EntityTypeId> {
  protected readonly entityTypeColorMap = new Map<string, string>();

  /**
   * Contains the state.
   * Returns the current state immediately after subscribing.
   * @protected
   */
  protected readonly storeSubject = new BehaviorSubject<
    EntityConverter<EntityTypeId>
  >(this.getInitialValue());

  /**
   * Returns the initial value of the stored subject.
   * @protected
   */
  protected getInitialValue(): EntityConverter<EntityTypeId> {
    return (entity) => {
      const type = this.getTypeOfEntity(entity);
      let color = this.entityTypeColorMap.get(type);
      if (!color) {
        color = getNthColor(this.entityTypeColorMap.size);
        this.entityTypeColorMap.set(type, color);
      }
      return { color };
    };
  }

  protected abstract getTypeOfEntity(entityTypeId: EntityTypeId): string;

  /**
   * Returns an observable that outputs the stored value.
   */
  public getState(): Observable<EntityConverter<EntityTypeId>> {
    return this.storeSubject.pipe();
  }

  /**
   * Returns the current value of the stored value.
   */
  public getValue(): EntityConverter<EntityTypeId> {
    return this.storeSubject.value;
  }
}
