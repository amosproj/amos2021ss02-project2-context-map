import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import consolidateQueryResult from '../utils/consolidateQueryResult';
import { FilterCondition, FilterQuery, QueryResult } from '../shared/queries';
import FilterConditionBuilder from './FilterConditionBuilder';
import { allocateParamKey } from './allocateParamKey';
import { FilterServiceBase } from './filter.service.base';
import {
  EdgeTypeFilterModel,
  FilterModelEntry,
  NodeTypeFilterModel,
} from '../shared/filter';

@Injectable()
export class FilterService implements FilterServiceBase {
  constructor(private readonly neo4jService: Neo4jService) {}

  async query(query?: FilterQuery): Promise<QueryResult> {
    const nodeFilter = query?.filters?.nodes;
    const nodeLimit = query?.limits?.nodes;
    const nodes =
      nodeLimit === 0 ? [] : await this.getNodes(nodeFilter, nodeLimit);

    const edgeFilter = query?.filters?.edges;
    const edgeLimit = query?.limits?.edges;
    const edges =
      edgeLimit === 0 ? [] : await this.getEdges(edgeFilter, edgeLimit);

    const queryResult = { nodes, edges };

    return consolidateQueryResult(queryResult, true);
  }

  private async getNodes(
    filter?: FilterCondition,
    limit?: number
  ): Promise<NodeDescriptor[]> {
    const {
      condition,
      queryParams,
    } = FilterConditionBuilder.buildFilterCondition('node', 'n', filter);
    let query = 'MATCH (n)';

    if (condition !== null) {
      query = `${query} WHERE ${condition}`;
    }

    query = `${query} RETURN ID(n) as id`;

    if (limit !== undefined) {
      const limitParamKey = allocateParamKey(queryParams, 'limit');
      // toInteger required, since apparently it converts int to double.
      query = `${query} LIMIT toInteger($${limitParamKey})`;
      queryParams[limitParamKey] = limit;
    }

    const result = await this.neo4jService.read(query, queryParams);
    return result.records.map((x) => x.toObject() as NodeDescriptor);
  }

  private async getEdges(
    filter?: FilterCondition,
    limit?: number
  ): Promise<EdgeDescriptor[]> {
    const {
      condition,
      queryParams,
    } = FilterConditionBuilder.buildFilterCondition('edge', 'e', filter);
    let query = 'MATCH (from)-[e]->(to)';

    if (condition !== null) {
      query = `${query} WHERE ${condition}`;
    }

    query = `${query} RETURN ID(e) as id, ID(from) as from, ID(to) as to`;

    if (limit !== undefined) {
      const limitParamKey = allocateParamKey(queryParams, 'limit');
      // toInteger required, since apparently it converts int to double.
      query = `${query} LIMIT toInteger($${limitParamKey})`;
      queryParams[limitParamKey] = limit;
    }

    const result = await this.neo4jService.read(query, queryParams);
    return result.records.map((x) => x.toObject() as EdgeDescriptor);
  }

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
