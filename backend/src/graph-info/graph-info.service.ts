import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { parseNeo4jEntityInfo } from './parseNeo4jEntityInfo';
import { EntityType } from '../shared/graph-information/EntityType';

@Injectable()
export class GraphInfoService {
  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Returns information about all nodes or edges of a graph
   * @param which get graph info about nodes ('node') or relationships/edges ('rel')
   */
  async getEntityTypes(which: 'node' | 'rel'): Promise<EntityType[]> {
    // Throw Error to avoid "SQL"-injection
    if (which !== 'node' && which !== 'rel') {
      throw Error(`Parameter must be either 'node' or 'rel'`);
    }

    const result = await this.neo4jService.read(
      `CALL db.schema.${which}TypeProperties`
    );

    return parseNeo4jEntityInfo(result.records, which);
  }
}
