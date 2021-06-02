import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Node, EdgeDescriptor, Edge, NodeDescriptor } from './shared/entities';
import { CountQueryResult, QueryBase, QueryResult } from './shared/queries';
import { consolidateQueryResult } from './utils';
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
          : await this.queryNodes(query?.limits?.nodes),
      edges:
        query?.limits?.edges === 0
          ? []
          : await this.queryEdges(query?.limits?.edges),
    };

    return consolidateQueryResult(queryResult);
  }

  /**
   * Queries NodeDescriptors for a given limit of number of nodes
   *
   * @param nodeLimit  limit number of nodes to be queried
   * @return NodeDescriptor as a result of the Query
   */
  private async queryNodes(nodeLimit?: number): Promise<NodeDescriptor[]> {
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
   * Queries nodes for a given array of ids.
   *
   * @param ids node-ids that are being searched for.
   * @return array of nodes having the input-ids as id ordered by id
   */
  public async getNodesById(ids: number[]): Promise<Node[]> {
    const result = await this.neo4jService.read(
      `MATCH (n) WHERE ID(n) IN $ids RETURN ${neo4jReturnNode('n')}`,
      { ids }
    );

    return result.records.map((record) => record.toObject() as Node);
  }

  /**
   * Queries all node details
   * @return Array of all node details present in the database.
   */
  public async getNodes(): Promise<Node[]> {
    const result = await this.neo4jService.read(
      `MATCH (n) RETURN ${neo4jReturnNode('n')}`
    );

    return result.records.map((record) => record.toObject() as Node);
  }

  /**
   * Queries EdgeDescriptors for a given limit of number of edges
   *
   * @param edgeLimit  limit number of edges to be queried
   * @return EdgeDescriptor as a result of the Query
   */
  private async queryEdges(edgeLimit?: number): Promise<EdgeDescriptor[]> {
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
   * Queries edges for a given array of idsd.
   *
   * @param ids  edge-ids that are being searched for.
   * @return array of edges having the input-ids as id ordered by id
   */
  public async getEdgesById(ids: number[]): Promise<Edge[]> {
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

  /**
   * Queries all edge details.
   * @return Array of all edge details present in the database.
   */
  public async getEdges(): Promise<Edge[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (from)-[e]->(to) 
      RETURN ${neo4jReturnEdge('e', 'from', 'to')}
      ORDER BY id, from
      `
    );

    return result.records.map((r) => r.toObject() as Edge);
  }

  /**
   * Returns the number of nodes and edges in the graph
   */
  async getNumberOfEntities(): Promise<CountQueryResult> {
    const result = await this.neo4jService.read(
      `
        CALL {
            MATCH (n)
            RETURN count(n) as nodes
        }
        CALL {
            MATCH ()-[e]->()
            RETURN count(e) as edges
        }
        return nodes, edges
    `
    );

    return result.records[0].toObject() as CountQueryResult;
  }
}
