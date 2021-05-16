import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { RequiredPipe } from '../pipes/RequiredPipe';
import { SearchResult } from '../shared/search/SearchResult';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Filters through all properties of all nodes and all edges (case-insensitive) .
   * @param filter filter string ("if node/edge-property contains filter -> return it")
   */
  @Get('all')
  all(@Query('filter', RequiredPipe) filter: string): Promise<SearchResult> {
    return this.searchService.search(filter);
  }

  /**
   * Gets suggestions for the specified filter string.
   * @param filter The filter string.
   */
  @Get('suggestions')
  suggestions(
    @Query('filter', RequiredPipe) filter: string
  ): Promise<string[]> {
    return this.searchService.getAutoSuggestions(filter);
  }
}
