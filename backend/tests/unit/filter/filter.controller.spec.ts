import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FilterController } from '../../../src/filter/filter.controller';
import { FilterService } from '../../../src/filter/filter.service';
import {
  getEdgeTypeFilterModelResult,
  getNodeTypeFilterModelResult,
} from '../../fixtures/filter/FilterQueryResults';
import FilterServiceMock from '../../fixtures/filter/FilterServicMock';

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
