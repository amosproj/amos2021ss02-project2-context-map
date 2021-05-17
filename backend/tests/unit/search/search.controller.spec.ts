import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SearchController } from '../../../src/search/search.controller';
import { SearchService } from '../../../src/search/search.service';
import { ISearchService } from '../../../src/search/ISearch.service';
import { notImplemented } from '../notImplemented';

describe('SearchController', () => {
  let app: INestApplication;
  const baseUrl = '/search';
  const mockSearchService: ISearchService = {
    search: notImplemented,
    getAutoSuggestions: notImplemented,
  };

  // Global setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
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

  describe(`Search all`, () => {
    it('should not fail when called with filter string', async () => {
      jest.spyOn(mockSearchService, 'search').mockImplementation(() =>
        Promise.resolve({
          nodes: [],
          edges: [],
          edgeTypes: [],
          nodeTypes: [],
        })
      );

      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/all?filter=trinity`)
        // Assert
        .expect(200);
    });

    it('should fail when called with empty filter', async () => {
      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/all?filter=`)
        // Assert
        .expect(400);
    });

    it('should fail when called with not query param', async () => {
      // Act
      await request(app.getHttpServer())
        .get(`${baseUrl}/all`)
        // Assert
        .expect(400);
    });
  });
});
