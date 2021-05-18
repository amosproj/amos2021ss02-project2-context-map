import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import consolidateQueryResult from '../utils/consolidateQueryResult';
import { FilterCondition, FilterQuery, QueryResult } from '../shared/queries';
import FilterConditionBuilder, { QueryParams } from './FilterConditionBuilder';
import { allocateParamKey } from './allocateParamKey';

function buildFilterCondition(
  entity: 'node' | 'edge',
  name: string,
  filter?: FilterCondition
): [string | null, QueryParams] {
  if (filter === undefined) {
    return [null, {}];
  }

  const conditionBuilder = new FilterConditionBuilder(entity, name);
  return conditionBuilder.buildCondition(filter);
}

@Injectable()
export class FilterService {
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

    return consolidateQueryResult(queryResult);
  }

  private async getNodes(
    filter?: FilterCondition,
    limit?: number
  ): Promise<NodeDescriptor[]> {
    const [condition, params] = buildFilterCondition('node', 'n', filter);
    let query = 'MATCH (n)';

    if (condition !== null) {
      query = `${query} WHERE ${condition}`;
    }

    query = `${query} RETURN ID(n) as id`;

    if (limit !== undefined) {
      const limitParamKey = allocateParamKey(params, 'limit');
      // toInteger required, since apparently it converts int to double.
      query = `${query}LIMIT toInteger($${limitParamKey})`;
      params[limitParamKey] = limit;
    }

    const result = await this.neo4jService.read(query, params);
    return result.records.map((x) => x.toObject() as NodeDescriptor);
  }

  private async getEdges(
    filter?: FilterCondition,
    limit?: number
  ): Promise<EdgeDescriptor[]> {
    const [condition, params] = buildFilterCondition('edge', 'e', filter);
    let query = 'MATCH (from)-[e]->(to)';

    if (condition !== null) {
      query = `${query} WHERE ${condition}`;
    }

    query = `${query} RETURN ID(e) as id, ID(from) as from, ID(to) as to`;

    if (limit !== undefined) {
      const limitParamKey = allocateParamKey(params, 'limit');
      // toInteger required, since apparently it converts int to double.
      query = `${query}LIMIT toInteger($${limitParamKey})`;
      params[limitParamKey] = limit;
    }

    const result = await this.neo4jService.read(query, params);
    return result.records.map((x) => x.toObject() as EdgeDescriptor);
  }
}
