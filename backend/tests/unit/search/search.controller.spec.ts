import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SearchController } from '../../../src/search/search.controller';
import { SearchService } from '../../../src/search/search.service';

describe('SearchController', () => {
  let app: INestApplication;
  const baseUrl = '/search';
  const mockSearchService = {
    searchInNodeProperties: jest.fn(() => []),
    searchInEdgeProperties: jest.fn(() => []),
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

  /* eslint-disable no-loop-func, no-restricted-syntax -- allow loop */
  for (const what of ['edges', 'nodes', 'all']) {
    /* eslint-disable no-restricted-syntax -- allow describe and it in loop */
    describe(`Search ${what}`, () => {
      it('should not fail when called with filter string', async () => {
        // Act
        await request(app.getHttpServer())
          .get(`${baseUrl}/${what}?filter=hallo`)
          // Assert
          .expect(200);
      });

      it('should fail when called with empty filter', async () => {
        // Act
        await request(app.getHttpServer())
          .get(`${baseUrl}/${what}?filter=`)
          // Assert
          .expect(400);
      });

      it('should fail when called with not query param', async () => {
        // Act
        await request(app.getHttpServer())
          .get(`${baseUrl}/${what}`)
          // Assert
          .expect(400);
      });
    });
  }
});
