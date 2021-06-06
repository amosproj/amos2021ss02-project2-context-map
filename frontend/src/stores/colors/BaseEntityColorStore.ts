/* istanbul ignore file */

import 'reflect-metadata';
import { injectable } from 'inversify';
import { BehaviorSubject, Observable } from 'rxjs';
import EntityVisualisationAttributes from './EntityVisualisationAttributes';
import getNthColor from './getNthColor';
import { EdgeDescriptor, NodeDescriptor } from '../../shared/entities';

export type EntityColorizer<T> = (type: T) => EntityVisualisationAttributes;

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export default abstract class BaseEntityColorStore<
  Entity extends EdgeDescriptor | NodeDescriptor
> {
  protected readonly entityTypeColorMap = new Map<string, string>();

  /**
   * Contains the state.
   * Returns the current state immediately after subscribing.
   * @protected
   */
  protected readonly storeSubject = new BehaviorSubject<
    EntityColorizer<Entity>
  >(this.getInitialValue());

  /**
   * Returns the initial value of the stored subject.
   * @protected
   */
  protected getInitialValue(): EntityColorizer<Entity> {
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

  protected abstract getTypeOfEntity(entityTypeId: Entity): string;

  /**
   * Returns an observable that outputs the stored value.
   */
  public getState(): Observable<EntityColorizer<Entity>> {
    return this.storeSubject.pipe();
  }

  /**
   * Returns the current value of the stored value.
   */
  public getValue(): EntityColorizer<Entity> {
    return this.storeSubject.value;
  }
}
