import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { SchemaService } from '../schema/schema.service';
import { createTextSearchCypher } from './createTextSearchCypher';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';

@Injectable()
export class SearchService {
  /**
   * Cypher query for a text search through edges
   * @private
   */
  private edgeFulltextQuery: string | undefined;

  /**
   * Cypher query for a text search through nodes
   * @private
   */
  private nodeFulltextQuery: string | undefined;

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly schemaService: SchemaService
  ) {}

  /**
   * Sets {@link edgeFulltextQuery}.
   * @private
   */
  private async loadEdgeFulltextQuery() {
    const schema = await this.schemaService.getEdgeTypes();
    this.edgeFulltextQuery = createTextSearchCypher(schema, 'edges');
    return this.edgeFulltextQuery;
  }

  /**
   * Sets {@link nodeFulltextQuery}
   * @private
   */
  private async loadNodeFulltextQuery() {
    const schema = await this.schemaService.getNodeTypes();
    this.nodeFulltextQuery = createTextSearchCypher(schema, 'nodes');
    return this.nodeFulltextQuery;
  }

  /**
   * Filters through all properties of all edges (case-insensitive) .
   * @param filter filter string ("if edge-property contains filter -> return it")
   */
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

  /**
   * Filters through all properties of all nodes (case-insensitive) .
   * @param filter filter string ("if node-property contains filter -> return it")
   */
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
