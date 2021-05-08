import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Node } from './entities/Node';
import { EdgeDescriptor } from './entities/EdgeDescriptor';
import { Edge } from './entities/Edge';
import { QueryResult } from './entities/queries/QueryResult';
import { LimitQuery } from './entities/queries/LimitQuery';
import { NodeDescriptor } from './entities/NodeDescriptor';

@Injectable()
export class AppService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async queryAll(query?: LimitQuery): Promise<QueryResult> {
    return {
      edges: await this.getAllEdges(query),
      nodes: await this.getAllNodes(query),
    };
  }

  /**
   * Returns a list the ids of all nodes
   */
  private async getAllNodes(query?: LimitQuery): Promise<NodeDescriptor[]> {
    // toInteger required, since apparently it converts int to double...
    const result = await this.neo4jService.read(
      `
      MATCH (n)
      RETURN ID(n) as id
      ${query?.limit?.nodes ? 'LIMIT toInteger($limitNodes)' : ''}
    `,
      {
        limitNodes: query?.limit?.nodes,
      },
    );
    return result.records.map((x) => x.toObject() as NodeDescriptor);
  }

  /**
   * Returns list of Nodes
   */
  async getNodesById(ids: number[]): Promise<Node[]> {
    const result = await this.neo4jService.read(
      'MATCH (n) WHERE ID(n) IN $ids RETURN ID(n) as id, labels(n) as labels, properties(n) as properties',
      { ids },
    );

    return result.records.map((record) => record.toObject() as Node);
  }

  /**
   * Returns a list the ids of all edges
   */
  private async getAllEdges(query?: LimitQuery): Promise<EdgeDescriptor[]> {
    console.log(query, {
      limitEdges: query?.limit?.edges,
    });
    // toInteger required, since apparently it converts int to double...
    const result = await this.neo4jService.read(
      `
      MATCH (from)-[e]-(to) 
      RETURN ID(e) as id, ID(from) as from, ID(to) as to
      ${query?.limit?.edges ? 'LIMIT toInteger($limitEdges)' : ''}
    `,
      {
        limitEdges: query?.limit?.edges,
      },
    );
    return result.records.map((r) => r.toObject() as EdgeDescriptor);
  }

  /**
   * Returns list of detailed edges
   *
   * @example call it with /getEdgesById?ids=1&ids=2
   */
  async getEdgesById(ids: number[]): Promise<Edge[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (from)-[e]-(to) 
      WHERE ID(e) in $ids
      RETURN ID(e) as id, ID(from) as from, ID(to) as to, properties(e) as properties, type(e) as type
    `,
      { ids },
    );

    return result.records.map((r) => r.toObject() as Edge);
  }
}
