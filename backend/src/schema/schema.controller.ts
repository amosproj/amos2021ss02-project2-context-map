import { Controller, Get } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { NodeType } from '../shared/schema/NodeType';
import { EdgeType } from '../shared/schema/EdgeType';

@Controller('schema')
export class SchemaController {
  constructor(private readonly graphInfoService: SchemaService) {}

  /**
   * Returns information about all edges of a graph
   */
  @Get('edge-types')
  getEdgeTypes(): Promise<EdgeType[]> {
    return this.graphInfoService.getEdgeTypes();
  }

  /**
   * Returns information about all nodes of a graph
   */
  @Get('node-types')
  getNodeTypes(): Promise<NodeType[]> {
    return this.graphInfoService.getNodeTypes();
  }
}
