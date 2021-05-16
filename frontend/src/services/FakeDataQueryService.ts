import { injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../shared/queries/LimitQuery';
import { QueryResult } from '../shared/queries/QueryResult';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import delay from '../utils/delay';
import QueryService from './QueryService';
import { CancellationToken } from '../utils/CancellationToken';
import getRandomIndex from '../utils/getRandomIndex';

/**
 * A fake implementation that delivers random data.
 */
@injectable()
export default class FakeDataQueryService extends QueryService {
  private readonly allowSelfReferencingNodes: boolean;

  public constructor(allowSelfReferencingNodes = true) {
    super();
    this.allowSelfReferencingNodes = allowSelfReferencingNodes;
  }

  public async queryAll(
    query?: LimitQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    await delay(0, cancellation);

    const numNodes = query?.limit?.nodes ?? 100;
    const numEdges = query?.limit?.edges ?? 150;
    const nodes: NodeDescriptor[] = [];
    const edges: EdgeDescriptor[] = [];

    for (let i = 0; i < numNodes; i += 1) {
      nodes.push({ id: i });
    }

    for (let i = 0; i < numEdges; i += 1) {
      const from = getRandomIndex(numNodes);
      let to = getRandomIndex(numNodes);

      if (!this.allowSelfReferencingNodes) {
        while (to === from) {
          to = getRandomIndex(numNodes);
        }
      }

      edges.push({
        id: i,
        from,
        to,
      });
    }

    return { nodes, edges };
  }
}
