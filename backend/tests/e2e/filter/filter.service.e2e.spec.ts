import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { FilterService } from '../../../src/filter/filter.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import {
  getEdgeTypeFilterModelResult,
  getNodeTypeFilterModelResult,
} from '../../fixtures/filter/FilterQueryResults';
import {
  FilterQuery,
  OfTypeCondition,
  QueryResult,
} from '../../../src/shared/queries';

/*
Tests filter.service.ts
 */
describe('FilterService', () => {
  describe('testing-dump', () => {
    let service: FilterService;
    let neo4jService: Neo4jService;

    // Global Setup
    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          KmapNeo4jModule.forRootTesting(
            { disableLosslessIntegers: true },
            7687
          ),
        ],
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

    describe('Method query', () => {
      it('returns all nodes including subsidiary ones', async () => {
        // Arrange
        const query: FilterQuery = {
          filters: {
            nodes: OfTypeCondition('Movie'),
            edges: OfTypeCondition('DIRECTED'),
          },
        };

        const expectedQueryResult: QueryResult = {
          nodes: [{ id: 0 }, { id: 3, subsidiary: true }],
          edges: [{ id: 2, from: 3, to: 0 }],
        };

        // Act
        const result = await service.query(query);

        // Assert
        expect(result).toEqual(expectedQueryResult);
      });
    });

    describe('Method getNodeTypeFilterModel', () => {
      it('should return node filter model when requested', async () => {
        // Act
        const result = await service.getNodeTypeFilterModel('Movie');

        // Assert
        expect(result).toEqual(getNodeTypeFilterModelResult);
      });

      it('should return empty result when type is unknown', async () => {
        // Arrange
        const expected = { name: 'Unknown', properties: [] };

        // Act
        const result = await service.getNodeTypeFilterModel('Unknown');

        // Assert
        expect(result).toStrictEqual(expected);
      });
    });

    describe('Method getEdgeTypeFilterModel', () => {
      it('should return edge filter model when requested', async () => {
        // Act
        const result = await service.getEdgeTypeFilterModel('ACTED_IN');

        // Assert
        expect(result).toEqual(getEdgeTypeFilterModelResult);
      });

      it('should return empty result when type is unknown', async () => {
        // Arrange
        const expected = { name: 'Unknown', properties: [] };

        // Act
        const result = await service.getEdgeTypeFilterModel('Unknown');

        // Assert
        expect(result).toStrictEqual(expected);
      });
    });
  });
});
