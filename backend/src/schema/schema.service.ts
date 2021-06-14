import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { parseNeo4jEntityInfo } from './parseNeo4jEntityInfo';
import { EdgeType, NodeType } from '../shared/schema';

@Injectable()
export class SchemaService {
  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Returns information about all edges of a graph
   */
  async getEdgeTypes(): Promise<EdgeType[]> {
    const result = await this.neo4jService.read(
      `CALL db.schema.relTypeProperties`
    );
    return parseNeo4jEntityInfo(result.records, 'rel');
  }

  /**
   * Returns information about all nodes of a graph
   */
  async getNodeTypes(): Promise<NodeType[]> {
    const result = await this.neo4jService.read(
      `CALL db.schema.nodeTypeProperties`
    );
    return parseNeo4jEntityInfo(result.records, 'node');
  }
}
