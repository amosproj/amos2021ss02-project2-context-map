import { FilterServiceBase } from '../../../src/filter/filter.service.base';
import {
  EdgeTypeFilterModel,
  NodeTypeFilterModel,
} from '../../../src/shared/filter';
import {
  getEdgeTypeFilterModelResult,
  getNodeTypeFilterModelResult,
} from './FilterQueryResults';

export default class FilterServiceMock implements FilterServiceBase {
  // eslint-disable-next-line class-methods-use-this
  public getNodeTypeFilterModel(type: string): Promise<NodeTypeFilterModel> {
    let result: NodeTypeFilterModel = {
      name: type,
      properties: [],
    };

    if (type === 'Movie') {
      result = getNodeTypeFilterModelResult;
    }

    return Promise.resolve(result);
  }

  // eslint-disable-next-line class-methods-use-this
  public getEdgeTypeFilterModel(type: string): Promise<EdgeTypeFilterModel> {
    let result: EdgeTypeFilterModel = {
      name: type,
      properties: [],
    };

    if (type === 'ACTED_IN') {
      result = getEdgeTypeFilterModelResult;
    }

    return Promise.resolve(result);
  }
}
