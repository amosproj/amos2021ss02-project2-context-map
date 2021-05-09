import { injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../entities/queries/LimitQuery';
import { QueryResult } from '../entities/queries/QueryResult';
import { NodeDescriptor } from '../entities/NodeDescriptor';
import { EdgeDescriptor } from '../entities/EdgeDescriptor';
import delay from '../utils/delay';
import QueryService from './QueryService';
import { CancellationToken, None } from '../utils/CancellationToken';

export function getRandomIndex(n: number): number {
  return Math.floor(Math.random() * n);
}

@injectable()
export class FakeDataQueryService extends QueryService {
  private readonly allowSelfReferencingNodes: boolean;

  public constructor(allowSelfReferencingNodes = true) {
    super();
    this.allowSelfReferencingNodes = allowSelfReferencingNodes;
  }

  public async queryAll(
    query?: LimitQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    await delay(5000, cancellation ?? None);

    const numNodes = query?.limit?.nodes ?? 200;
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
