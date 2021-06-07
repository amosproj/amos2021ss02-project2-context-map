import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import {
  QueryEdgeResult,
  QueryResult,
  ShortestPathQuery,
} from '../shared/queries';
import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import { Path, PathEdgeEntry } from './Path';
import { ShortestPathServiceBase } from './shortest-path.service.base';
import { FilterService } from '../filter/filter.service';
import { range } from '../utils';
import { AppService } from '../app.service';

const KMAP_GDS_GRAPH_NAME_SHORTEST_PATH = 'KMAP_GDS_GRAPH_NAME_SHORTEST_PATH';
const KMAP_GDS_GRAPH_NAME_SHORTEST_PATH_DIRECTED =
  'KMAP_GDS_GRAPH_NAME_SHORTEST_PATH_DIRECTED';

@Injectable()
export class ShortestPathService implements ShortestPathServiceBase {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly filterService: FilterService,
    private readonly queryService: AppService
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
    let startNode = queryResult.nodes.find((node) => node.id === path.start.id);

    let startNodeAdded = false;

    if (!startNode) {
      startNode = path.start;
      queryResult.nodes.push(startNode);
      startNodeAdded = true;
    }

    startNode.isPath = true;

    // Add the end node to the query result and mark it as path
    let endNode = queryResult.nodes.find((node) => node.id === path.end.id);

    let endNodeAdded = false;

    if (!endNode) {
      endNode = path.end;
      queryResult.nodes.push(endNode);
      endNodeAdded = true;
    }

    endNode.isPath = true;

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

    let lastNode = startNode;

    // The true id of the last node, not the virtual id, if last node is virtual.
    let lastNodeId = startNode.id;

    // Walk the path from the start to the end
    for (const currEdge of path.edges) {
      // Get the id of the currently processed node.
      // We cannot just use curr.to, as paths can ignore edge directions, so
      // the direction of the current edge may be flipped and point from
      // currNode to lastNode
      const currNodeId =
        currEdge.to === lastNodeId ? currEdge.from : currEdge.to;

      // We assume that the start node is already present in the query-result
      // Check whether the end-node is present
      const currNode = queryResult.nodes.find((node) => node.id === currNodeId);

      // The target node was found. Mark it as path.
      if (currNode) {
        currNode.isPath = true;

        // Check whether the edge from source node to target node is in the query-result.
        // This can only be the case, if the source-node is not virtual.
        if (!lastNode.virtual) {
          const edge = queryResult.edges.find((e) => e.id === currEdge.id);

          // The edge was found. Mark it as path.
          if (edge) {
            edge.isPath = true;
          }
          // The edge was not found. Insert it.
          else {
            let subsidiary = true;

            // Edges to/from the path start node and edges to/from the path end node
            // are per definition subsidiary, only when we did not add the start/end node to
            // the query-result.
            if (startNodeAdded && lastNodeId === startNode.id) {
              subsidiary = false;
            }

            if (endNodeAdded && currNode.id === endNode.id) {
              subsidiary = false;
            }

            const edgeToAdd: QueryEdgeResult = {
              id: currEdge.id,
              from: currEdge.from,
              to: currEdge.to,
              type: currEdge.type,
              isPath: true,
            };

            if (subsidiary) {
              edgeToAdd.subsidiary = true;
            }

            queryResult.edges.push(edgeToAdd);
          }
        }
        // The source node is virtual. Add a virtual edge to the target node.
        else {
          const vEdgeId = getNextVEdgeId();
          // Do not take the real id of the last node, but the allocated virtual id.
          let from = lastNode.id;
          let to = currNodeId;

          // The current edge points from curr to last (the reverse of the path direction)
          if (currNodeId === currEdge.from) {
            const acc = from;
            from = to;
            to = acc;
          }

          queryResult.edges.push({
            id: vEdgeId,
            from,
            to,
            type: '',
            virtual: true,
            isPath: true,
          });
        }

        lastNode = currNode;
      }
      // The target node was not-found. Check whether the source node is virtual. If it is
      // we don't have to do anything, as the virtual node already replaces a complete
      // subgraph (that our node now will become part of), if it is not, we have to create
      // it as a replacement for the subgraph. In the last case, we also have to insert
      // a virtual edge.
      else if (!lastNode.virtual) {
        const vEdgeId = getNextVEdgeId();
        const vNodeId = getNextVNodeId();
        let from = lastNodeId;
        let to = vNodeId;

        // The current edge points from curr to last (the reverse of the path direction)
        if (currNodeId === currEdge.from) {
          const acc = from;
          from = to;
          to = acc;
        }

        queryResult.edges.push({
          id: vEdgeId,
          from,
          to,
          type: '',
          virtual: true,
          isPath: true,
        });

        lastNode = {
          id: vNodeId,
          types: [],
          virtual: true,
          isPath: true,
        };

        queryResult.nodes.push(lastNode);
      }

      lastNodeId = currNodeId;
    }

    return queryResult;
  }

  public async findShortestPath(
    startNode: number,
    endNode: number,
    ignoreEdgeDirections?: boolean
  ): Promise<Path | null> {
    if (startNode === endNode) {
      const nodeDetails = (
        await this.queryService.getNodesById([startNode])
      ).find(() => true);

      if (!nodeDetails) {
        return null;
      }

      return {
        start: { id: nodeDetails.id, types: nodeDetails.types },
        end: { id: nodeDetails.id, types: nodeDetails.types },
        edges: [],
      };
    }

    const graphName = ignoreEdgeDirections
      ? KMAP_GDS_GRAPH_NAME_SHORTEST_PATH
      : KMAP_GDS_GRAPH_NAME_SHORTEST_PATH_DIRECTED;

    if (!(await this.existsGDSProjection(graphName))) {
      await this.createGDSProjection(graphName, ignoreEdgeDirections);
    }

    // eslint-disable-next-line no-return-await
    return await this.execGDSShortestPath(
      graphName,
      startNode,
      endNode,
      ignoreEdgeDirections
    );
  }

  private async createGDSProjection(
    name: string,
    ignoreEdgeDirections: boolean | undefined
  ): Promise<void> {
    await this.neo4jService.read(
      `
      CALL gds.graph.create.cypher(
        $name,
        'MATCH (m) 
         RETURN id(m) as id',
        'MATCH (m)-[e]${ignoreEdgeDirections ? '-' : '->'}(n) 
         RETURN id(m) as source, id(n) as target, 1 as cost'
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
    ignoreEdgeDirections: boolean | undefined
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
      YIELD nodeIds
      UNWIND nodeIds as id
      MATCH (n) 
      WHERE ID(n) = id
      RETURN id, labels(n) as types
      `,
      { name, startNode, endNode }
    );

    const nodes = result.records.map((x) => x.toObject() as NodeDescriptor);

    if (nodes.length === 0) {
      return null;
    }

    if (nodes.length === 1) {
      return {
        start: nodes[0],
        end: nodes[0],
        edges: [],
      };
    }

    const promises = range(nodes.length - 1).map(
      async (i): Promise<EdgeDescriptor | null> => {
        const sourceNode = nodes[i];
        const targetNode = nodes[i + 1];

        // eslint-disable-next-line no-await-in-loop
        const edgeResult = await this.neo4jService.read(
          `
          MATCH (m)-[e]->(n) 
          WHERE ((ID(m) = $startId AND ID(n) = $endId)${
            ignoreEdgeDirections
              ? ' OR (ID(n) = $startId AND ID(m) = $endId)'
              : ''
          })
          WITH ID(e) as id, ID(m) as from, ID(n) as to, type(e) as type, 1 as cost 
          ORDER BY cost 
          LIMIT 1 
          RETURN id, from, to, cost, type
          `,
          { startId: sourceNode.id, endId: targetNode.id }
        );

        const edgeCandidates = edgeResult.records.map(
          (x) => x.toObject() as PathEdgeEntry
        );

        if (edgeCandidates.length === 0) {
          return null;
        }

        return edgeCandidates[0];
      }
    );

    const edges = await Promise.all(promises);

    if (edges.some((e) => !e)) {
      return null;
    }

    return {
      start: nodes[0],
      end: nodes[nodes.length - 1],
      edges: edges as PathEdgeEntry[],
    };
  }
}
