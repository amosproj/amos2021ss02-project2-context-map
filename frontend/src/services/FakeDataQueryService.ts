import { injectable } from 'inversify';
import 'reflect-metadata';
import { QueryBase, QueryResult } from '../shared/queries';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import delay from '../utils/delay';
import QueryService from './QueryService';
import { CancellationToken } from '../utils/CancellationToken';
import getRandomInteger from '../utils/getRandomInteger';

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
    query?: QueryBase,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    await delay(0, cancellation);

    const numNodes = query?.limits?.nodes ?? 100;
    const numEdges = query?.limits?.edges ?? 150;
    const nodes: NodeDescriptor[] = [];
    const edges: EdgeDescriptor[] = [];

    for (let i = 0; i < numNodes; i += 1) {
      nodes.push({ id: i });
    }

    for (let i = 0; i < numEdges; i += 1) {
      const from = getRandomInteger(numNodes);
      let to = getRandomInteger(numNodes);

      if (!this.allowSelfReferencingNodes) {
        while (to === from) {
          to = getRandomInteger(numNodes);
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
