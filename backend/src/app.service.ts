import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Node } from './entities/Node';
import { Edge } from './entities/Edge';
import { DetailedEdge } from './entities/DetailedEdge';

@Injectable()
export class AppService {
  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Returns a list the ids of all nodes
   */
  async getAllNodes(): Promise<number[]> {
    const result = await this.neo4jService.read('MATCH (n) RETURN ID(n) as id');
    return result.records.map((x) => x.toObject().id as number);
  }

  /**
   * Returns list of Nodes
   */
  async getNodeDetails(ids: number[]): Promise<Node[]> {
    const result = await this.neo4jService.read(
      'MATCH (n) WHERE ID(n) IN $ids RETURN ID(n) as id, labels(n) as labels, properties(n) as properties',
      { ids },
    );

    return result.records.map((record) => record.toObject() as Node);
  }

  /**
   * Returns a list the ids of all edges
   */
  async getAllEdges(): Promise<Edge[]> {
    const result = await this.neo4jService.read(`
      MATCH (from)-[e]-(to) 
      RETURN ID(e) as id, ID(from) as from, ID(to) as to
    `);
    return result.records.map((r) => r.toObject() as Edge);
  }

  /**
   * Returns list of detailed edges
   *
   * @example call it with /getEdgeDetails?ids=1&ids=2
   */
  async getEdgeDetails(ids: number[]): Promise<DetailedEdge[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (from)-[e]-(to) 
      WHERE ID(e) in $ids
      RETURN ID(e) as id, ID(from) as from, ID(to) as to, properties(e) as properties, type(e) as type
    `,
      { ids },
    );

    return result.records.map((r) => r.toObject() as DetailedEdge);
  }
}
