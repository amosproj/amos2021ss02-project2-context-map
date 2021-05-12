import { Controller, Get, Query } from '@nestjs/common';
import { GraphInfoService } from './graph-info.service';
import { EntityType } from '../shared/graph-information/EntityType';

@Controller('graphInfo')
export class GraphInfoController {
  constructor(private readonly graphInfoService: GraphInfoService) {}

  /**
   * Returns information about all nodes or edges of a graph
   * @param whichQuery either 'nodes' or 'edges'
   */
  @Get('getEntityTypes')
  getEntityTypes(@Query('which') whichQuery: string): Promise<EntityType[]> {
    let about: 'node' | 'rel';
    if (whichQuery === 'edges') {
      about = 'rel';
    } else if (whichQuery === 'nodes') {
      about = 'node';
    } else {
      throw Error(`Query-Parameter 'about' must be either 'nodes' or 'edges'`);
    }

    return this.graphInfoService.getEntityTypes(about);
  }
}
