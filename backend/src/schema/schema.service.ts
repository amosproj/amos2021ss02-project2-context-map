import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { parseNeo4jEntityInfo } from './parseNeo4jEntityInfo';
import { EdgeType, NodeType, NodeTypeConnectionInfo } from '../shared/schema';
import { QueryResult } from '../shared/queries';
import {
  SchemaVisualisationResult,
  schemaVisualisationToQueryResult,
} from '../utils/schemaVisualisationToQueryResult';

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

  /**
   * Returns information about the number of connections between node types.
   * Nodes with n labels are considered as n nodes of a single label (e.g. node
   * :Person:Customer is considered as node :Person and node :Customer).
   * This information can be visualized in a Chord diagram.
   */
  async getNodeTypeConnectionInformation(): Promise<NodeTypeConnectionInfo[]> {
    const result = await this.neo4jService.read(`
      CALL db.schema.nodeTypeProperties() YIELD nodeLabels AS result
      // flatten ["Person", ["Person", "Customer"]] => ["Person", "Person", "Customer"]
      UNWIND result as nodeTypes
      // remove duplicates => ["Person", "Customer"]
      WITH DISTINCT nodeTypes as nodeTypes
      
      // make List
      WITH collect(nodeTypes) as nodeTypes
      
      // build cross product of list => [{from: "Person", to: "Person"}, {from: "Person", to: "Customer"}, ...]
      WITH REDUCE(ret = [], A in nodeTypes |
          ret + REDUCE(ret2 = [], B in nodeTypes | ret2 + {from: A, to: B})
      ) as nodeTypes
      
      // each list entry as row
      UNWIND nodeTypes as possibleConnections
      
      // get number of connections between nodes
      CALL {
          WITH possibleConnections
          MATCH (a)-->(b)
          WHERE possibleConnections['from'] in labels(a) AND possibleConnections['to'] in labels(b)
          RETURN count(*)
          as numConnections
      }
      
      RETURN possibleConnections['from'] as from, possibleConnections['to'] as to, numConnections
    `);

    return result.records.map((x) => x.toObject() as NodeTypeConnectionInfo);
  }

  /**
   * Returns a {@link QueryResult} containing the meta information about the
   * graph, i.e. which node types are connected to which other node types.
   *
   * The nodes.types always have the length 1.
   */
  async getMetaGraph(): Promise<QueryResult> {
    const result = await this.neo4jService.read(
      `CALL db.schema.visualization()`
    );
    return schemaVisualisationToQueryResult(
      result.records[0].toObject() as SchemaVisualisationResult
    );
  }
}
