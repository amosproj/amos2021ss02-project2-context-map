import { Controller, Get } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { NodeType, EdgeType, NodeTypeConnectionInfo } from '../shared/schema';
import { QueryResult } from '../shared/queries';

@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  /**
   * Returns information about all edges of a graph
   */
  @Get('edge-types')
  getEdgeTypes(): Promise<EdgeType[]> {
    return this.schemaService.getEdgeTypes();
  }

  /**
   * Returns information about all nodes of a graph
   */
  @Get('node-types')
  getNodeTypes(): Promise<NodeType[]> {
    return this.schemaService.getNodeTypes();
  }

  /**
   * Returns information about the number of connections between node types.
   * @see {@link SchemaService.getEntityConnectionInfo}
   */
  @Get('node-type-connection-info')
  getNodeTypeConnectionInformation(): Promise<NodeTypeConnectionInfo[]> {
    return this.schemaService.getNodeTypeConnectionInformation();
  }

  /**
   * Returns a {@link QueryResult} containing the meta information about the
   * graph, i.e. which node types are connected to which other node types.
   *
   * The nodes.types always have the length 1.
   */
  @Get('meta-graph')
  getMetaGraph(): Promise<QueryResult> {
    return this.schemaService.getMetaGraph();
  }
}
