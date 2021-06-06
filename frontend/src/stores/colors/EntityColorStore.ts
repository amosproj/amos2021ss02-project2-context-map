import 'reflect-metadata';
import { injectable } from 'inversify';
import { BehaviorSubject, Observable } from 'rxjs';
import EntityVisualisationAttributes from './EntityVisualisationAttributes';
import getNthColor from './getNthColor';
import { EdgeDescriptor, NodeDescriptor } from '../../shared/entities';
import { ArgumentError } from '../../shared/errors';

export type EntityColorizer = (type: Entity) => EntityVisualisationAttributes;

const isEdgeDescriptor = (
  e: EdgeDescriptor | NodeDescriptor
): e is EdgeDescriptor => 'type' in e;

const isNodeDescriptor = (
  e: EdgeDescriptor | NodeDescriptor
): e is NodeDescriptor => 'types' in e;

type Entity = EdgeDescriptor | NodeDescriptor;

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export class EntityColorStore {
  protected readonly entityTypeColorMap = new Map<string, string>();

  /**
   * Contains the state.
   * Returns the current state immediately after subscribing.
   * @protected
   */
  protected readonly storeSubject = new BehaviorSubject<EntityColorizer>(
    this.getInitialValue()
  );

  /**
   * Returns the initial value of the stored subject.
   * @protected
   */
  protected getInitialValue(): EntityColorizer {
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

  protected getTypeOfEntity(entity: Entity): string {
    if (isEdgeDescriptor(entity)) {
      return `EDGE ${entity.type}`;
    }
    if (isNodeDescriptor(entity)) {
      return `NODE ${entity.types
        .map((x) => x)
        .sort((a, b) => a.localeCompare(b))
        .join(' ')}`;
    }
    /* istanbul ignore next */
    throw new ArgumentError('Argument is neither a node nor an edge');
  }

  /**
   * Returns an observable that outputs the stored value.
   */
  public getState(): Observable<EntityColorizer> {
    return this.storeSubject.pipe();
  }

  /**
   * Returns the current value of the stored value.
   */
  public getValue(): EntityColorizer {
    return this.storeSubject.value;
  }
}

export default EntityColorStore;
