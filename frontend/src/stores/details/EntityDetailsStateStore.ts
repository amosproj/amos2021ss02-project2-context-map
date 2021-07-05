import 'reflect-metadata';
import { injectable } from 'inversify';
import SimpleStore from '../SimpleStore';
import { EntityDetailsState } from './EntityDetailsState';

@injectable()
export class EntityDetailsStateStore extends SimpleStore<EntityDetailsState> {
  protected getInitialValue(): EntityDetailsState {
    return { node: null };
  }

  public clear(): void {
    this.setState(this.getInitialValue());
  }

  public showNode(node: number): void {
    this.mergeState({ node });
  }
}

export default EntityDetailsStateStore;
