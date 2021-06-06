import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import { consolidateQueryResult, allocateQueryParamName } from '../utils';
import { FilterCondition, FilterQuery, QueryResult } from '../shared/queries';
import FilterConditionBuilder from './FilterConditionBuilder';
import { FilterServiceBase } from './filter.service.base';
import {
  EdgeTypeFilterModel,
  FilterModelEntry,
  NodeTypeFilterModel,
} from '../shared/filter';
import {
  neo4jReturnEdgeDescriptor,
  neo4jReturnNodeDescriptor,
} from '../config/commonFunctions';

/**
 * The default implementation of the filter service for the neo4j database.
 */
@Injectable()
export class FilterService implements FilterServiceBase {
  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * @inheritdoc
   */
  async query(query?: FilterQuery): Promise<QueryResult> {
    // Extract the necessary parameters from the query object split for
    // nodes and edges as we process them separately.
    const nodeFilter = query?.filters?.nodes;
    const nodeLimit = query?.limits?.nodes;

    // Request the nodes from the database, or use an empty array, if the
    // limit is set to zero, as the database interprets a limit of zero
    // as unlimited.
    const nodes =
      nodeLimit === 0 ? [] : await this.getNodes(nodeFilter, nodeLimit);

    const edgeFilter = query?.filters?.edges;
    const edgeLimit = query?.limits?.edges;

    // Request the edges from the database, or use an empty array, if the
    // limit is set to zero, as the database interprets a limit of zero
    // as unlimited.
    const edges =
      edgeLimit === 0 ? [] : await this.getEdges(edgeFilter, edgeLimit);

    // Build our query result.
    const queryResult = { nodes, edges };

    // Post process the query result to dedupe entities and consolidate
    // references nodes.
    return consolidateQueryResult(queryResult, true);
  }

  /**
   * Requests all nodes that match the specified filter condition within the
   * specified limits.
   * @param filter The filter condition or `undefined` to query all nodes.
   * @param limit The maximum number of nodes to return or 'undefined' if no limit is set.
   */
  private async getNodes(
    filter?: FilterCondition,
    limit?: number
  ): Promise<NodeDescriptor[]> {
    // First build the query-condition, that is the "WHERE" clause of the cypher
    // query with the help of the FilterConditionBuilder type.
    // The 'condition' variable contains our condition, or null if no condition is
    // specified (query-all), the 'queryParams' variable contains the database
    // query parameters (key-value pairs) that we can extend and pass to the
    // database.
    const {
      condition,
      queryParams,
    } = FilterConditionBuilder.buildFilterCondition('node', 'n', filter);

    // Now build the cypher query in the form
    // MATCH (n)
    // WHERE { condition }
    // RETURN ID(n) as id
    // LIMIT toInteger({ limit })
    let query = 'MATCH (n)';

    // Only add the WHERE clause and the condition if there is a condition set.
    if (condition !== null) {
      query = `${query} WHERE ${condition}`;
    }

    query = `${query} ${neo4jReturnNodeDescriptor('n')}`;

    // Only add a LIMIT clause if a limit is specified.
    if (limit !== undefined) {
      const limitParamKey = allocateQueryParamName(queryParams, 'limit');
      // toInteger required, since apparently it converts int to double.
      query = `${query} LIMIT toInteger($${limitParamKey})`;
      queryParams[limitParamKey] = limit;
    }

    // Now execute the query and transform the query result to the type of
    // result we can further process.
    const result = await this.neo4jService.read(query, queryParams);
    return result.records.map((x) => x.toObject() as NodeDescriptor);
  }

  /**
   * Requests all edges that match the specified filter condition within the
   * specified limits.
   * @param filter The filter condition or `undefined` to query all edges.
   * @param limit The maximum number of edges to return or 'undefined' if no limit is set.
   */
  private async getEdges(
    filter?: FilterCondition,
    limit?: number
  ): Promise<EdgeDescriptor[]> {
    // First build the query-condition, that is the "WHERE" clause of the cypher
    // query with the help of the FilterConditionBuilder type.
    // The 'condition' variable contains our condition, or null if no condition is
    // specified (query-all), the 'queryParams' variable contains the database
    // query parameters (key-value pairs) that we can extend and pass to the
    // database.
    const {
      condition,
      queryParams,
    } = FilterConditionBuilder.buildFilterCondition('edge', 'e', filter);

    // Now build the cypher query in the form
    // MATCH MATCH (from)-[e]->(to)
    // WHERE { condition }
    // RETURN RETURN ID(e) as id, ID(from) as from, ID(to) as to
    // LIMIT toInteger({ limit })
    let query = 'MATCH (from)-[e]->(to)';

    // Only add the WHERE clause and the condition if there is a condition set.
    if (condition !== null) {
      query = `${query} WHERE ${condition}`;
    }

    query = `${query} ${neo4jReturnEdgeDescriptor('e', 'from', 'to')}`;

    // Only add a LIMIT clause if a limit is specified.
    if (limit !== undefined) {
      const limitParamKey = allocateQueryParamName(queryParams, 'limit');
      // toInteger required, since apparently it converts int to double.
      query = `${query} LIMIT toInteger($${limitParamKey})`;
      queryParams[limitParamKey] = limit;
    }

    // Now execute the query and transform the query result to the type of
    // result we can further process.
    const result = await this.neo4jService.read(query, queryParams);
    return result.records.map((x) => x.toObject() as EdgeDescriptor);
  }

  /**
   * @inheritdoc
   */
  public async getNodeTypeFilterModel(
    type: string
  ): Promise<NodeTypeFilterModel> {
    // This basically looks up the values that are present in the database for each property of all
    // entities of the specified type in a distinct way.
    // Example:
    // Say, the db contains for the specified type these entries (where name and date are properties):
    // | id | name | date   |
    // | 1  | abc  | 20/1/1 |
    // | 2  | abc  | 20/1/1 |
    // | 3  | abc  | 22/1/1 |
    // | 5  | def  | 21/2/3 |
    // The result would look like:
    // name: [abc, def]
    // date: [20/1/1, 22/1/1, 21/2/3]
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

  /**
   * @inheritdoc
   */
  public async getEdgeTypeFilterModel(
    type: string
  ): Promise<EdgeTypeFilterModel> {
    // This basically looks up the values that are present in the database for each property of all
    // entities of the specified type in a distinct way.
    // Example:
    // Say, the db contains for the specified type these entries (where name and date are properties):
    // | id | name | date   |
    // | 1  | abc  | 20/1/1 |
    // | 2  | abc  | 20/1/1 |
    // | 3  | abc  | 22/1/1 |
    // | 5  | def  | 21/2/3 |
    // The result would look like:
    // name: [abc, def]
    // date: [20/1/1, 22/1/1, 21/2/3]
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
