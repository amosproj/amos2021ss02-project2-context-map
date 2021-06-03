import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { NodeDescriptor } from '../shared/entities';
import { Path } from './Path';
import { ShortestPathServiceBase } from './shortest-path.service.base';

const KMAP_GDS_GRAPH_NAME_SHORTEST_PATH = 'KMAP_GDS_GRAPH_NAME_SHORTEST_PATH';

@Injectable()
export class ShortestPathService implements ShortestPathServiceBase {
  constructor(private readonly neo4jService: Neo4jService) {}

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
