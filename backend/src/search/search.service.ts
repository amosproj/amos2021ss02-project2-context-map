import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { SchemaService } from '../schema/schema.service';
import { createTextSearchCypher } from './createTextSearchCypher';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';

@Injectable()
export class SearchService {
  private edgeFulltextQuery: string | undefined;

  private nodeFulltextQuery: string | undefined;

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly schemaService: SchemaService
  ) {}

  private async loadEdgeFulltextQuery() {
    const schema = await this.schemaService.getEdgeTypes();
    this.edgeFulltextQuery = createTextSearchCypher(schema, 'edges');
    return this.edgeFulltextQuery;
  }

  private async loadNodeFulltextQuery() {
    const schema = await this.schemaService.getNodeTypes();
    this.nodeFulltextQuery = createTextSearchCypher(schema, 'nodes');
    return this.nodeFulltextQuery;
  }

  async searchInEdgeProperties(filter: string): Promise<EdgeDescriptor[]> {
    let query = this.edgeFulltextQuery;
    if (!query) {
      query = await this.loadEdgeFulltextQuery();
    }

    const result = await this.neo4jService.read(query, {
      filter,
    });
    return result.records.map((r) => r.toObject() as EdgeDescriptor);
  }

  async searchInNodeProperties(filter: string): Promise<NodeDescriptor[]> {
    let query = this.nodeFulltextQuery;
    if (!query) {
      query = await this.loadNodeFulltextQuery();
    }

    const result = await this.neo4jService.read(query, {
      filter,
    });
    return result.records.map((r) => r.toObject() as NodeDescriptor);
  }
}
