import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { Node } from './shared/entities/Node';
import { Edge } from './shared/entities/Edge';
import { ParseIntArrayPipe } from './pipes/ParseIntArrayPipe';
import { AppService } from './app.service';
import { LimitQuery } from './shared/queries/LimitQuery';
import { QueryResult } from './shared/queries/QueryResult';

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
  @Post('queryAll')
  @HttpCode(200)
  async queryAll(@Body() query?: LimitQuery): Promise<QueryResult> {
    return this.appService.queryAll(query);
  }

  /**
   * Returns list of Nodes
   */
  @Get('getNodesById')
  async getNodesById(
    @Query('ids', ParseIntArrayPipe) ids: number[],
  ): Promise<Node[]> {
    return this.appService.getNodesById(ids);
  }

  /**
   * Returns list of detailed edges
   *
   * @example call it with /getEdgesById?ids=1&ids=2
   */
  @Get('getEdgesById')
  async getEdgesById(
    @Query('ids', ParseIntArrayPipe) ids: number[],
  ): Promise<Edge[]> {
    return this.appService.getEdgesById(ids);
  }
}
