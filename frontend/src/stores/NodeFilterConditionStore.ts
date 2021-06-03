import { injectable } from 'inversify';
import SimpleStore from './SimpleStore';
import { FilterCondition, OfTypeCondition } from '../shared/queries';

@injectable()
export default class NodeFilterConditionStore extends SimpleStore<FilterCondition> {
  protected getInitialValue(): FilterCondition {
    return OfTypeCondition('None');
  }
}
