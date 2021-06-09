import 'reflect-metadata';
import { injectable } from 'inversify';
import SimpleStore from '../SimpleStore';
import { EntityStyleState } from './EntityStyleState';

@injectable()
export class EntityStyleStateStore extends SimpleStore<EntityStyleState> {
  protected getInitialValue(): EntityStyleState {
    return {
      greyScaleEdges: false,
    };
  }
}

export default EntityStyleStateStore;
