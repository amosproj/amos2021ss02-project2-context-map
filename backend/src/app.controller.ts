import { Controller, Get, Query } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
import { Node } from "./entities/Node";
import { Edge } from "./entities/Edge";
import { DetailedEdge } from "./entities/DetailedEdge";

/**
 * Main App Controller.
 * ATM there are no only a few endpoints, so only one controller is used.
 */
@Controller()
export class AppController {
  constructor(private readonly neo4jService: Neo4jService) {
  }

  /**
   * Returns a list the ids of all nodes
   */
  @Get("getAllNodes")
  async getAllNodes(): Promise<number[]> {
    const result = await this.neo4jService.read("MATCH (n) RETURN ID(n) as id");

    const ids: number[] = [];
    result.records.forEach(function(record) {
      // .toNumber() otherwise it returns { "low": id, "high": 0 }
      ids.push(record.get("id").toNumber());
    });

    return ids;
  }

  /**
   * Returns list of Nodes
   * TODO Use a pipe to map query-params to array of numbers (currently string(s))
   */
  @Get("getNodeDetails")
  async getNodeDetails(@Query("ids") ids: number[]): Promise<Node[]> {
    const result = await this.neo4jService.read(
      "MATCH (n) WHERE ID(n) IN [2, 4] RETURN ID(n) as id, labels(n) as labels, properties(n) as properties",
      { ids }
    );

    const nodes: Node[] = [];
    result.records.forEach(function(record) {
      nodes.push({
        id: record.get("id").toNumber(), labels: record.get("labels"),
        properties: Object.keys(record.get("properties")).reduce(function(filtered, key) {
          // TODO: convert { "low": id, "high": 0 } to number
          filtered[key] = record.get("properties")[key];
          return filtered;
        }, {})
      });
    });

    return nodes;
  }

  /**
   * Returns a list the ids of all edges
   */
  @Get("getAllEdges")
  async getAllEdges(): Promise<Edge[]> {
    // TODO return the IDs
    return [];
  }

  /**
   * Returns list of detailed edges
   * TODO Use a pipe to map query-params to array of numbers (currently string(s))
   */
  @Get("getEdgeDetails")
  async getEdgeDetails(@Query("ids") ids: number[]): Promise<DetailedEdge[]> {
    // TODO return objects
    return [];
  }
}
