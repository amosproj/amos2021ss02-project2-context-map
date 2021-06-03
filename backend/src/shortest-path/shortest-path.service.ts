import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { QueryResult } from '../shared/queries';
import { NodeDescriptor } from '../shared/entities';
import { Path } from './Path';
import {
  ShortestPathQuery,
  ShortestPathServiceBase,
} from './shortest-path.service.base';
import { FilterService } from '../filter/filter.service';

const KMAP_GDS_GRAPH_NAME_SHORTEST_PATH = 'KMAP_GDS_GRAPH_NAME_SHORTEST_PATH';

@Injectable()
export class ShortestPathService implements ShortestPathServiceBase {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly filterService: FilterService
  ) {}

  public async executeQuery(query: ShortestPathQuery): Promise<QueryResult> {
    const path = await this.findShortestPath(
      query.startNode,
      query.endNode,
      query.ignoreEdgeDirections
    );

    const queryResult = await this.filterService.query(query);

    if (path === null) {
      return queryResult;
    }

    // Add the start node to the query result and mark it as path
    let startNode = queryResult.nodes.find(
      (node) => node.id === path.nodes[0].id
    );

    if (!startNode) {
      [startNode] = path.nodes;
      queryResult.nodes.push(startNode);
    }

    startNode.isPath = true;

    // Add the end node to the query result and mark it as path
    let endNode = queryResult.nodes.find(
      (node) => node.id === path.nodes[path.nodes.length - 1].id
    );

    if (!endNode) {
      endNode = path.nodes[path.nodes.length - 1];
      queryResult.nodes.push(endNode);
    }

    endNode.isPath = true;

    let sourceNode = startNode;

    // TODO: Is it guaranteed, that neo4j ids are never negative? It would be better if we use some other datatype, like string instead of number
    //       and prefix virtual entities with some unique string.
    let nextVEdgeId = -1;
    let nextVNodeId = -1;

    const getNextVEdgeId = (): number => {
      const result = nextVEdgeId;
      nextVEdgeId -= 1;
      return result;
    };

    const getNextVNodeId = (): number => {
      const result = nextVNodeId;
      nextVNodeId -= 1;
      return result;
    };

    // Walk the path from the start to the end
    for (const curr of path.edges) {
      // We assume that the start node is already present in the query-result
      // Check whether the end-node is present
      const targetNode = queryResult.nodes.find((node) => node.id === curr.to);

      // The target node was found. Mark it as path.
      if (targetNode) {
        targetNode.isPath = true;

        // Check whether the edge from source node to target node is in the query-result.
        // This can only be the case, if the source-node is not virtual.
        if (!sourceNode.virtual) {
          const edge = queryResult.edges.find((e) => e.id === curr.id);

          // The edge was found. Mark it as path.
          if (edge) {
            edge.isPath = true;
          }
          // The edge was not found. Insert it.
          else {
            queryResult.edges.push({
              ...curr,
              subsidiary: true,
            });
          }
        }
        // The source node is virtual. Add a virtual edge to the target node.
        else {
          const vEdgeId = getNextVEdgeId();
          queryResult.edges.push({
            id: vEdgeId,
            from: sourceNode.id,
            to: targetNode.id,
            virtual: true,
            isPath: true,
          });
        }

        sourceNode = targetNode;
      }
      // The target node was not-found. Check whether the source node is virtual. If it is
      // we don't have to do anything, as the virtual node already replaces a complete
      // subgraph (that our node now will become part of), if it is not, we have to create
      // it as a replacement for the subgraph. In the last case, we also have to insert
      // a virtual edge.
      else if (!sourceNode.virtual) {
        const vEdgeId = getNextVEdgeId();
        const vNodeId = getNextVNodeId();

        queryResult.edges.push({
          id: vEdgeId,
          from: sourceNode.id,
          to: vNodeId,
          virtual: true,
          isPath: true,
        });

        sourceNode = {
          id: vNodeId,
          virtual: true,
          isPath: true,
        };

        queryResult.nodes.push(sourceNode);
      }
    }

    return queryResult;
  }

  public async findShortestPath(
    startNode: number,
    endNode: number,
    ignoreEdgeDirections?: boolean
  ): Promise<Path | null> {
    if (startNode === endNode) {
      if (!(await this.nodeExists(startNode))) {
        return null;
      }

      return {
        nodes: [{ id: startNode }],
        edges: [],
      };
    }

    if (!(await this.existsGDSProjection(KMAP_GDS_GRAPH_NAME_SHORTEST_PATH))) {
      await this.createGDSProjection(KMAP_GDS_GRAPH_NAME_SHORTEST_PATH);
    }

    // eslint-disable-next-line no-return-await
    return await this.execGDSShortestPath(
      KMAP_GDS_GRAPH_NAME_SHORTEST_PATH,
      startNode,
      endNode,
      ignoreEdgeDirections
    );
  }

  private async nodeExists(id: number): Promise<boolean> {
    const result = await this.neo4jService.read(
      `
      MATCH(n) WHERE id(n) = $id RETURN id(n) as id
      `,
      { id }
    );

    const nodes = result.records.map((x) => x.toObject() as NodeDescriptor);

    return nodes.length !== 0 && nodes.some((node) => node.id === id);
  }

  private async createGDSProjection(name: string): Promise<void> {
    await this.neo4jService.read(
      `
      CALL gds.graph.create.cypher(
        $name,
        'MATCH (m) RETURN id(m) as id',
        'MATCH (m)-[e]-(n) RETURN id(m) as source, id(n) as target, 1 as cost'
      )
      `,
      { name }
    );
  }

  private async existsGDSProjection(name: string): Promise<boolean> {
    const result = await this.neo4jService.read(
      `
      CALL gds.graph.exists($name) YIELD exists;
      `,
      { name }
    );

    return result.records.map((x) => x.toObject() as { exists: boolean })[0]
      .exists;
  }

  private async deleteGDSProjection(name: string): Promise<boolean> {
    const result = await this.neo4jService.read(
      `
      CALL gds.graph.drop($name, false) YIELD graphName;
      `,
      { name }
    );

    const convertedResults = result.records.map(
      (x) => x.toObject() as { n?: string }
    );

    return convertedResults.length > 0 && convertedResults[0].n !== undefined;
  }

  private async execGDSShortestPath(
    name: string,
    startNode: number,
    endNode: number,
    ignoreEdgeDirections?: boolean
  ): Promise<Path | null> {
    const result = await this.neo4jService.read(
      `
      MATCH(start), (end) 
        WHERE (ID(start) = $startNode AND ID(end) = $endNode) 
        CALL gds.shortestPath.dijkstra.stream($name, {
            sourceNode: start,
            targetNode: end,
            relationshipWeightProperty: 'cost'
        })
        YIELd nodeIds
        UNWIND nodeIds as id
        RETURN id
      `,
      { name, startNode, endNode }
    );

    const nodes = result.records.map((x) => x.toObject() as NodeDescriptor);

    if (nodes.length === 0) {
      return null;
    }

    if (nodes.length === 1) {
      return {
        nodes,
        edges: [],
      };
    }

    const startNodes = nodes.slice(0, -1);
    const endNodes = nodes.slice(1);
    const edges = [];

    // TODO: Can we do this with a one-shot?
    for (let i = 0; i < startNodes.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const edgeResult = await this.neo4jService.read(
        `
        MATCH (m)-[e]${ignoreEdgeDirections ? '-' : '->'}(n) 
        WHERE (id(m) = $startId AND id(n) = $endId) 
        WITH id(e) as id, 1 as cost 
        ORDER BY cost 
        LIMIT 1 
        RETURN id, cost
        `,
        { startId: startNodes[i].id, endId: endNodes[i].id }
      );

      const edgeCandidates = edgeResult.records.map(
        (x) => x.toObject() as { id: number; cost: number }
      );

      if (edgeCandidates.length === 0) {
        return null;
      }

      edges.push({
        id: edgeCandidates[0].id,
        from: startNodes[i].id,
        to: endNodes[i].id,
      });
    }

    return { nodes, edges };
  }
}
