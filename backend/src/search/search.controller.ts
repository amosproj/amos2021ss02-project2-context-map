import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { QueryResult } from '../shared/queries/QueryResult';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { RequiredPipe } from '../pipes/RequiredPipe';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('edges')
  searchInEdgeProperties(
    @Query('filter', RequiredPipe) filter: string
  ): Promise<EdgeDescriptor[]> {
    return this.searchService.searchInEdgeProperties(filter);
  }

  @Get('nodes')
  searchInNodeProperties(
    @Query('filter', RequiredPipe) filter: string
  ): Promise<NodeDescriptor[]> {
    return this.searchService.searchInNodeProperties(filter);
  }

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
