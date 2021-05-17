import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Property } from '../shared/entities/Property';

interface NodeTypeFilterModel {
  name: string;
  properties: FilterModelEntry[];
}

interface EdgeTypeFilterModel {
  name: string;
  properties: FilterModelEntry[];
}

interface FilterModelEntry {
  key: string;
  values: Property[];
}

@Injectable()
export class FilterService {
  constructor(private readonly neo4jService: Neo4jService) {}

  public async getNodeTypeFilterModel(
    nodeType: string
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
      { nodeType }
    );

    const properties = result.records.map(
      (x) => x.toObject() as FilterModelEntry
    );

    return {
      name: nodeType,
      properties,
    };
  }

  public async getEdgeTypeFilterModel(
    edgeType: string
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
      { edgeType }
    );

    const properties = result.records.map(
      (x) => x.toObject() as FilterModelEntry
    );

    return {
      name: edgeType,
      properties,
    };
  }
}
