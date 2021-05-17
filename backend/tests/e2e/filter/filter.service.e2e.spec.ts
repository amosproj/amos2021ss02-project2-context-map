import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { FilterService } from '../../../src/filter/filter.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { AppModule } from '../../../src/app.module';
import {
  getEdgeTypeFilterModelResult,
  getNodeTypeFilterModelResult,
} from '../../fixtures/filter/FilterQueryResults';

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
      expect(result).toEqual(getNodeTypeFilterModelResult);
    });
  });

  describe('Method getEdgeTypeFilterModel', () => {
    it('should return edge filter model when requested', async () => {
      // Act
      const result = await service.getEdgeTypeFilterModel('ACTED_IN');

      // Assert
      expect(result).toEqual(getEdgeTypeFilterModelResult);
    });
  });
});
