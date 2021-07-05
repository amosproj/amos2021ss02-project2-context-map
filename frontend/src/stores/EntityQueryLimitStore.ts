import { injectable } from 'inversify';
import SimpleStore from './SimpleStore';
import { CountQueryResult } from '../shared/queries';

/**
 * Contains the current state of the number of entities to be displayed.
 */
@injectable()
export default class EntityQueryLimitStore extends SimpleStore<CountQueryResult> {
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
