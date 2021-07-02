import SimpleStore from './SimpleStore';
import { CountQueryResult } from '../shared/queries';

type EntityCounts = { nodes: number; edges: number };

export default class EntityCountsStore extends SimpleStore<EntityCounts> {
  protected getInitialValue(): CountQueryResult {
    return { nodes: 150, edges: 150 };
  }

  public reset(): void {
    this.setState(this.getInitialValue());
  }
}
