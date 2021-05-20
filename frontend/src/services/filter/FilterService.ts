import { injectable } from 'inversify';
import 'reflect-metadata';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../../shared/filter';
import { CancellationToken } from '../../utils/CancellationToken';

@injectable()
export default abstract class FilterService {
  public abstract getNodeTypeFilterModel(
    type: string,
    cancellation?: CancellationToken
  ): Promise<NodeTypeFilterModel>;

  public abstract getEdgeTypeFilterModel(
    type: string,
    cancellation?: CancellationToken
  ): Promise<EdgeTypeFilterModel>;
}
