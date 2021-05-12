import { Controller, Get } from '@nestjs/common';
import { GraphInfoService } from './graph-info.service';
import { NodeType } from '../shared/graph-information/NodeType';
import { EdgeType } from '../shared/graph-information/EdgeType';

@Controller('graphInfo')
export class GraphInfoController {
  constructor(private readonly graphInfoService: GraphInfoService) {}

  /**
   * Returns information about all edges of a graph
   */
  @Get('getEdgeTypes')
  getEdgeTypes(): Promise<EdgeType[]> {
    return this.graphInfoService.getEdgeTypes();
  }

  /**
   * Returns information about all nodes of a graph
   */
  @Get('getNodeTypes')
  getNodeTypes(): Promise<NodeType[]> {
    return this.graphInfoService.getNodeTypes();
  }
}
