import { injectable } from 'inversify';
import 'reflect-metadata';
import { FilterQuery } from '../shared/queries';
import SimpleStore from './SimpleStore';

@injectable()
export default class FilterStore extends SimpleStore<FilterQuery> {
  protected getInitialValue(): FilterQuery {
    return {};
  }
}
