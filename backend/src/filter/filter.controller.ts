import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';
import { FilterService } from './filter.service';
import { NodeTypeFilterModel } from '../shared/filter';
import { FilterQuery, QueryResult } from '../shared/queries';
import { RequiredPipe } from '../pipes/RequiredPipe';

@Controller('filter')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  /**
   * Returns a specialized filter model that contains the distinct values
   * of all properties of all nodes of the specified type.
   */
  @Post('query')
  @HttpCode(200)
  query(@Body(RequiredPipe) query?: FilterQuery): Promise<QueryResult> {
    return this.filterService.query(query);
  }

  /**
   * Returns a specialized filter model that contains the distinct values
   * of all properties of all nodes of the specified type.
   */
  @Get('node-type')
  getNodeTypeFilterModel(
    @Query('type') type: string
  ): Promise<NodeTypeFilterModel> {
    if (typeof type !== 'string' || type.length === 0) {
      // TODO: Replace with much better solution:
      // https://github.com/amosproj/amos-ss2021-project2-context-map/blob/0a972dc11e29ebe59343de48a497cdb0f98d5d94/backend/src/pipes/RequiredPipe.ts
      // See also: https://github.com/amosproj/amos-ss2021-project2-context-map/issues/110
      throw new BadRequestException();
    }

    return this.filterService.getNodeTypeFilterModel(type);
  }

  /**
   * Returns a specialized filter model that contains the distinct values
   * of all properties of all edges of the specified type.
   */
  @Get('edge-type')
  getEdgeTypeFilterModel(
    @Query('type') type: string
  ): Promise<NodeTypeFilterModel> {
    if (typeof type !== 'string' || type.length === 0) {
      // TODO: Replace with much better solution:
      // https://github.com/amosproj/amos-ss2021-project2-context-map/blob/0a972dc11e29ebe59343de48a497cdb0f98d5d94/backend/src/pipes/RequiredPipe.ts
      // See also: https://github.com/amosproj/amos-ss2021-project2-context-map/issues/110
      throw new BadRequestException();
    }

    return this.filterService.getEdgeTypeFilterModel(type);
  }
}
