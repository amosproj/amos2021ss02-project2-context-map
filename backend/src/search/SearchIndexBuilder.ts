import { Injectable } from '@nestjs/common';
import { SearchIndex } from './SearchIndex';
import { SchemaService } from '../schema/schema.service';
import { AppService } from '../app.service';

/**
 * A search index builder that can be used to build a search index from a complete dataset.
 */
@Injectable()
export class SearchIndexBuilder {
  public constructor(
    private readonly queryService: AppService,
    private readonly schemaService: SchemaService
  ) {}

  /**
   * Builds a search index for the dataset in the database.
   * @returns The constructed search index.
   */
  public buildIndex(): SearchIndex {
    return SearchIndex.create(this.queryService, this.schemaService);
  }
}
