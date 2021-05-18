import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { FilterServiceBase } from './filter.service.base';
import {
  EdgeTypeFilterModel,
  FilterModelEntry,
  NodeTypeFilterModel,
} from '../shared/filter';

@Injectable()
export class FilterService implements FilterServiceBase {
  constructor(private readonly neo4jService: Neo4jService) {}

  public async getNodeTypeFilterModel(
    type: string
  ): Promise<NodeTypeFilterModel> {
    const result = await this.neo4jService.read(
      `
        MATCH (n)
        WHERE $nodeType in labels(n)
        UNWIND keys(n) as m_keys
        WITH collect(distinct m_keys) as c_keys
        UNWIND c_keys AS key
        CALL {
          WITH key
          MATCH (m)
          RETURN collect(distinct m[key]) as values
        }
        RETURN key, values
      `,
      { nodeType: type }
    );

    const properties = result.records.map(
      (x) => x.toObject() as FilterModelEntry
    );

    return {
      name: type,
      properties,
    };
  }

  public async getEdgeTypeFilterModel(
    type: string
  ): Promise<EdgeTypeFilterModel> {
    const result = await this.neo4jService.read(
      `
        MATCH ()-[n]->()
        WHERE $edgeType = type(n)
        UNWIND keys(n) as m_keys
        WITH collect(distinct m_keys) as c_keys
        UNWIND c_keys AS key
        CALL {
          WITH key
          MATCH ()-[m]->()
          RETURN collect(distinct m[key]) as values
        }
        RETURN key, values
      `,
      { edgeType: type }
    );

    const properties = result.records.map(
      (x) => x.toObject() as FilterModelEntry
    );

    return {
      name: type,
      properties,
    };
  }
}
