import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Node } from './shared/entities/Node';
import { EdgeDescriptor } from './shared/entities/EdgeDescriptor';
import { Edge } from './shared/entities/Edge';
import { LimitQuery, QueryResult } from './shared/queries';
import { NodeDescriptor } from './shared/entities/NodeDescriptor';
import consolidateQueryResult from './utils/consolidateQueryResult';

@Injectable()
export class AppService {
  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Queries Node- and EdgeDescriptors for given LimitQuery
   *
   * @param query  sets limits for number of nodes and edges to be queried
   * @return Node- and EdgeDescriptors for given limitQuery as QueryResult
   */
  async queryAll(query?: LimitQuery): Promise<QueryResult> {
    const queryResult = {
      nodes:
        query?.limit?.nodes === 0
          ? []
          : await this.getAllNodes(query?.limit?.nodes),
      edges:
        query?.limit?.edges === 0
          ? []
          : await this.getAllEdges(query?.limit?.edges),
    };

    return consolidateQueryResult(queryResult);
  }

  /**
   * Queries NodeDescriptors for a given limit of number of nodes
   *
   * @param nodeLimit  limit number of nodes to be queried
   * @return NodeDescriptor as a result of the Query
   */
  private async getAllNodes(nodeLimit?: number): Promise<NodeDescriptor[]> {
    // toInteger required, since apparently it converts int to double...
    const result = await this.neo4jService.read(
      `
      MATCH (n) 
      RETURN ID(n) as id 
      ${nodeLimit ? 'LIMIT toInteger($limitNodes)' : ''}
    `,
      {
        limitNodes: nodeLimit,
      }
    );
    return result.records.map((x) => x.toObject() as NodeDescriptor);
  }

  /**
   * Queries nodes for a given array of ids
   *
   * @param ids  node-ids that are being searched for
   * @return array of nodes having the input-ids as id ordered by id
   */
  async getNodesById(ids: number[]): Promise<Node[]> {
    const result = await this.neo4jService.read(
      'MATCH (n) WHERE ID(n) IN $ids RETURN ID(n) as id, labels(n) as labels, properties(n) as properties',
      { ids }
    );

    return result.records.map((record) => record.toObject() as Node);
  }

  /**
   * Queries EdgeDescriptors for a given limit of number of edges
   *
   * @param edgeLimit  limit number of edges to be queried
   * @return EdgeDescriptor as a result of the Query
   */
  private async getAllEdges(edgeLimit?: number): Promise<EdgeDescriptor[]> {
    // toInteger required, since apparently it converts int to double...
    const result = await this.neo4jService.read(
      `
      MATCH (from)-[e]->(to) 
      RETURN ID(e) as id, ID(from) as from, ID(to) as to
      ORDER BY id, from
      ${edgeLimit ? 'LIMIT toInteger($limitEdges)' : ''}
    `,
      {
        limitEdges: edgeLimit,
      }
    );
    return result.records.map((r) => r.toObject() as EdgeDescriptor);
  }

  /**
   * Queries edges for a given array of ids
   *
   * @example call it with /getEdgesById?ids=1&ids=2
   * @param ids  edge-ids that are being searched for
   * @return array of edges having the input-ids as id ordered by id
   */
  async getEdgesById(ids: number[]): Promise<Edge[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (from)-[e]->(to) 
      WHERE ID(e) in $ids
      RETURN ID(e) as id, ID(from) as from, ID(to) as to, properties(e) as properties, type(e) as type
      ORDER BY id, from
    `,
      { ids }
    );

    return result.records.map((r) => r.toObject() as Edge);
  }
}
