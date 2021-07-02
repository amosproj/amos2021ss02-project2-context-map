import SimpleStore from './SimpleStore';
import { CountQueryResult } from '../shared/queries';

type EntityCounts = { nodes: number; edges: number };

/**
 * Contains the current state of the number of entities to be displayed.
 */
export default class EntityCountsStore extends SimpleStore<EntityCounts> {
  protected getInitialValue(): CountQueryResult {
    return { nodes: 150, edges: 150 };
  }

  /**
   * Resets the store to the initial value.
   */
  public reset(): void {
    this.setState(this.getInitialValue());
  }
}
