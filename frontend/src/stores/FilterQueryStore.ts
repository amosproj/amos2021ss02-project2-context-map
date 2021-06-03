import { injectable } from 'inversify';
import 'reflect-metadata';
import { FilterQuery } from '../shared/queries';
import SimpleStore from './SimpleStore';

/**
 * Contains the current state of the filter.
 */
@injectable()
export default class FilterQueryStore extends SimpleStore<FilterQuery> {
  protected getInitialValue(): FilterQuery {
    return {
      limits: { edges: 150, nodes: 200 },
      includeSubsidiary: true,
    };
  }
}
