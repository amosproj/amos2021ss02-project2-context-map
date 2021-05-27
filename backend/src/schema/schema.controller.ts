import { Controller, Get } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { NodeType, EdgeType } from '../shared/schema';

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
}
