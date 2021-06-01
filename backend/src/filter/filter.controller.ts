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
import FilterConditionValidator from './FilterConditionValidator';

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
    if (
      query?.filters?.edges &&
      !FilterConditionValidator.isValid(query?.filters?.edges)
    ) {
      throw new BadRequestException();
    }

    if (
      query?.filters?.nodes &&
      !FilterConditionValidator.isValid(query?.filters?.nodes)
    ) {
      throw new BadRequestException();
    }

    return this.filterService.query(query);
  }

  /**
   * Returns a specialized filter model that contains the distinct values
   * of all properties of all nodes of the specified type.
   */
  @Get('node-type')
  getNodeTypeFilterModel(
    @Query('type', RequiredPipe) type: string
  ): Promise<NodeTypeFilterModel> {
    return this.filterService.getNodeTypeFilterModel(type);
  }

  /**
   * Returns a specialized filter model that contains the distinct values
   * of all properties of all edges of the specified type.
   */
  @Get('edge-type')
  getEdgeTypeFilterModel(
    @Query('type', RequiredPipe) type: string
  ): Promise<NodeTypeFilterModel> {
    return this.filterService.getEdgeTypeFilterModel(type);
  }
}
