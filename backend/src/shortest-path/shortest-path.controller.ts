import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ShortestPathQuery, QueryResult } from '../shared/queries';
import { RequiredPipe } from '../pipes/RequiredPipe';
import FilterConditionValidator from '../filter/FilterConditionValidator';
import { ShortestPathService } from './shortest-path.service';

@Controller('shortest-path')
export class ShortestPathController {
  constructor(private readonly shortestPathService: ShortestPathService) {}

  /**
   * Returns a specialized filter model that contains the distinct values
   * of all properties of all nodes of the specified type.
   */
  @Post('query')
  @HttpCode(200)
  query(@Body(RequiredPipe) query: ShortestPathQuery): Promise<QueryResult> {
    // TODO: Stolen from FilterController
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

    if (!query.startNode) {
      throw new BadRequestException();
    }

    if (!query.endNode) {
      throw new BadRequestException();
    }

    return this.shortestPathService.executeQuery(query);
  }
}
