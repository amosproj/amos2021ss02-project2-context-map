import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { FilterService } from '../../../src/filter/filter.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { AppModule } from '../../../src/app.module';
import { edgeInfo, nodeInfo } from '../../fixtures/nodeInfo/GraphInfoDb';

/*
Tests filter.service.ts
Tests parseNeo4jEntityInfo indirectly
 */
describe('SchemaService', () => {
  let service: FilterService;
  let neo4jService: Neo4jService;

  // Global Setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KmapNeo4jModule],
      providers: [],
    }).compile();

    service = module.get<FilterService>(FilterService);
    neo4jService = await module.resolve(Neo4jService);
  });

  // Global teardown
  afterAll(async () => {
    await neo4jService.getDriver().close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Method getNodeTypeFilterModel', () => {
    it('should return node filter model when requested', async () => {
      // Act
      const result = await service.getNodeTypeFilterModel('Movie');

      // Assert
      // TODO: Make me beautiful
      expect(result).toEqual({"name": "Movie", "properties": [{"key": "title", "values": ["The Matrix"]}, {"key": "tagline", "values": ["Welcome to the Real World"]}, {"key": "released", "values": [1999]}]});
    });
  });

  describe('Method getEdgeTypeFilterModel', () => {
    it('should return edge filter model when requested', async () => {
      // Act
      const result = await service.getEdgeTypeFilterModel('ACTED_IN');

      // Assert
      // TODO: Make me beautiful
      expect(result).toEqual({"name": "ACTED_IN", "properties": [{"key": "roles", "values": [["Trinity"], ["Neo"]]}]});
    });
  });
});
