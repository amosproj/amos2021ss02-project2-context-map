import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { QueryResult } from '../shared/queries/QueryResult';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { RequiredPipe } from '../pipes/RequiredPipe';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Filters through all properties of all edges (case-insensitive) .
   * @param filter filter string ("if edge-property contains filter -> return it")
   */
  @Get('edges')
  searchInEdgeProperties(
    @Query('filter', RequiredPipe) filter: string
  ): Promise<EdgeDescriptor[]> {
    return this.searchService.searchInEdgeProperties(filter);
  }

  /**
   * Filters through all properties of all nodes (case-insensitive) .
   * @param filter filter string ("if node-property contains filter -> return it")
   */
  @Get('nodes')
  searchInNodeProperties(
    @Query('filter', RequiredPipe) filter: string
  ): Promise<NodeDescriptor[]> {
    return this.searchService.searchInNodeProperties(filter);
  }

  /**
   * Filters through all properties of all nodes and all edges (case-insensitive) .
   * @param filter filter string ("if node/edge-property contains filter -> return it")
   */
  @Get('all')
  async searchInAllEntitiesProperties(
    @Query('filter', RequiredPipe) filter: string
  ): Promise<QueryResult> {
    return {
      edges: await this.searchInEdgeProperties(filter),
      nodes: await this.searchInNodeProperties(filter),
    };
  }
}
