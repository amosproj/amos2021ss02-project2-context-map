import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { FilterController } from '../../../src/filter/filter.controller';
import { FilterService } from '../../../src/filter/filter.service';
import {
  getEdgeTypeFilterModelResult,
  getNodeTypeFilterModelResult,
} from '../../fixtures/filter/FilterQueryResults';
import FilterServiceMock from '../../fixtures/filter/FilterServicMock';
import {
  FilterQuery,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
  QueryResult,
} from '../../../src/shared/queries';

describe('FilterController', () => {
  let app: INestApplication;
  const baseUrl = '/filter';

  // Global setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilterController],
      providers: [
        {
          provide: FilterService,
          useValue: new FilterServiceMock(),
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  // Global teardown
  afterAll(async () => {
    await app.close();
  });

  describe(`query`, () => {
    it(`returns everything if no filter specified`, async () => {
      // Arrange
      const expected: QueryResult = {
        nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
        edges: [
          { id: 0, from: 1, to: 0 },
          { id: 1, from: 2, to: 0 },
          { id: 2, from: 3, to: 0 },
        ],
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        // Assert
        .expect(200, expected);
    });

    it(`filters correctly by node type`, async () => {
      // Arrange
      const query: FilterQuery = {
        filters: {
          nodes: OfTypeCondition('Movie'),
        },
      };

      const expected: QueryResult = {
        nodes: [{ id: 0 }],
        edges: [],
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(200, expected);
    });

    it(`filters correctly by edge type`, async () => {
      // Arrange
      const query: FilterQuery = {
        filters: {
          edges: OfTypeCondition('DIRECTED'),
        },
      };

      const expected: QueryResult = {
        nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
        edges: [{ id: 2, from: 3, to: 0 }],
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(200, expected);
    });

    it(`filters correctly by node property value`, async () => {
      // Arrange
      const query: FilterQuery = {
        filters: {
          nodes: MatchPropertyCondition('name', 'Keanu Reeves'),
        },
      };

      const expected: QueryResult = {
        nodes: [{ id: 1 }],
        edges: [],
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(200, expected);
    });

    // TODO: The test dataset currently does not allow to test for:
    // filters correctly by edge property value

    it(`filters correctly nodes with ALL condition`, async () => {
      // Arrange
      const query: FilterQuery = {
        filters: {
          nodes: MatchAllCondition(
            MatchPropertyCondition('name', 'Keanu Reeves'),
            OfTypeCondition('Person')
          ),
        },
      };

      const expected: QueryResult = {
        nodes: [{ id: 1 }],
        edges: [],
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(200, expected);
    });

    it(`filters correctly nodes with ANY condition`, async () => {
      // Arrange
      const query: FilterQuery = {
        filters: {
          nodes: MatchAnyCondition(
            MatchPropertyCondition('born', '1964'),
            OfTypeCondition('Person')
          ),
        },
      };

      const expected: QueryResult = {
        nodes: [{ id: 1 }, { id: 2 }, { id: 3 }],
        edges: [],
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(200, expected);
    });

    it(`filters correctly edges with ANY condition`, async () => {
      // Arrange
      const query: FilterQuery = {
        filters: {
          edges: MatchAnyCondition(
            OfTypeCondition('DIRECTED'),
            OfTypeCondition('ACTED_IN')
          ),
        },
      };

      const expected: QueryResult = {
        nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
        edges: [
          { id: 0, from: 1, to: 0 },
          { id: 1, from: 2, to: 0 },
          { id: 2, from: 3, to: 0 },
        ],
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(200, expected);
    });

    // TODO: The test dataset currently does not allow to test for:
    // filters correctly edges with ALL condition
  });

  describe(`getNodeTypeFilterModel`, () => {
    it('returns correct result with known type', async () => {
      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/node-type?type=Movie`)
        // Assert
        .expect(200, getNodeTypeFilterModelResult);
    });

    it('should return empty result when called with unknown type', async () => {
      // Arrange
      const expected = { name: 'Unknown', properties: [] };

      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/node-type?type=Unknown`)
        // Assert
        .expect(200, expected);
    });

    it('should fail when called with empty type', async () => {
      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/node-type?type=`)
        // Assert
        .expect(400);
    });

    it('should fail when called without type query param', async () => {
      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/node-type`)
        // Assert
        .expect(400);
    });
  });

  describe(`getEdgeTypeFilterModel`, () => {
    it('returns correct result with known type', async () => {
      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/edge-type?type=ACTED_IN`)
        // Assert
        .expect(200, getEdgeTypeFilterModelResult);
    });

    it('should return empty result when called with unknown type', async () => {
      // Arrange
      const expected = { name: 'Unknown', properties: [] };

      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/edge-type?type=Unknown`)
        // Assert
        .expect(200, expected);
    });

    it('should fail when called with empty type', async () => {
      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/edge-type?type=`)
        // Assert
        .expect(400);
    });

    it('should fail when called without type query param', async () => {
      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/edge-type`)
        // Assert
        .expect(400);
    });
  });
});
