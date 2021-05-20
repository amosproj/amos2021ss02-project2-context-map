import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Node } from './shared/entities/Node';
import { EdgeDescriptor } from './shared/entities/EdgeDescriptor';
import { Edge } from './shared/entities/Edge';
import { QueryBase, QueryResult } from './shared/queries';
import { NodeDescriptor } from './shared/entities/NodeDescriptor';
import consolidateQueryResult from './utils/consolidateQueryResult';
import {
  neo4jReturnEdge,
  neo4jReturnEdgeDescriptor,
  neo4jReturnNode,
  neo4jReturnNodeDescriptor,
} from './config/commonFunctions';

@Injectable()
export class AppService {
  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Queries Node- and EdgeDescriptors for given QueryBase
   *
   * @param query  sets limits for number of nodes and edges to be queried
   * @return Node- and EdgeDescriptors for given QueryBase as QueryResult
   */
  async queryAll(query?: QueryBase): Promise<QueryResult> {
    const queryResult = {
      nodes:
        query?.limits?.nodes === 0
          ? []
          : await this.getAllNodes(query?.limits?.nodes),
      edges:
        query?.limits?.edges === 0
          ? []
          : await this.getAllEdges(query?.limits?.edges),
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
      RETURN ${neo4jReturnNodeDescriptor('n')}
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
      `MATCH (n) WHERE ID(n) IN $ids RETURN ${neo4jReturnNode('n')}`,
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
      RETURN ${neo4jReturnEdgeDescriptor('e', 'from', 'to')}
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
      RETURN ${neo4jReturnEdge('e', 'from', 'to')}
      ORDER BY id, from
    `,
      { ids }
    );

    return result.records.map((r) => r.toObject() as Edge);
  }
}
