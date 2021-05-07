import { Controller, Get, Query } from '@nestjs/common';
import { Node } from './entities/Node';
import { Edge } from './entities/Edge';
import { DetailedEdge } from './entities/DetailedEdge';
import { ParseIntArrayPipe } from './pipes/ParseIntArrayPipe';
import { AppService } from './app.service';

/**
 * Main App Controller.
 * ATM there are no only a few endpoints, so only one controller is used.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns a list the ids of all nodes
   */
  @Get('getAllNodes')
  async getAllNodes(): Promise<number[]> {
    return this.appService.getAllNodes();
  }

  /**
   * Returns list of Nodes
   */
  @Get('getNodeDetails')
  async getNodeDetails(
    @Query('ids', ParseIntArrayPipe) ids: number[],
  ): Promise<Node[]> {
    return this.appService.getNodeDetails(ids);
  }

  /**
   * Returns a list the ids of all edges
   */
  @Get('getAllEdges')
  async getAllEdges(): Promise<Edge[]> {
    return this.appService.getAllEdges();
  }

  /**
   * Returns list of detailed edges
   *
   * @example call it with /getEdgeDetails?ids=1&ids=2
   */
  @Get('getEdgeDetails')
  async getEdgeDetails(
    @Query('ids', ParseIntArrayPipe) ids: number[],
  ): Promise<DetailedEdge[]> {
    return this.appService.getEdgeDetails(ids);
  }
}
