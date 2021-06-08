import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { notImplemented } from '../notImplemented';
import { ShortestPathServiceBase } from '../../../src/shortest-path/shortest-path.service.base';
import { ShortestPathController } from '../../../src/shortest-path/shortest-path.controller';
import { ShortestPathService } from '../../../src/shortest-path/shortest-path.service';

describe('SearchController', () => {
  let app: INestApplication;
  const baseUrl = '/shortest-path';
  const mockService: ShortestPathServiceBase = {
    executeQuery: notImplemented,
    findShortestPath: notImplemented,
  };

  // Global setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortestPathController],
      providers: [
        {
          provide: ShortestPathService,
          useValue: mockService,
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
    it('Returns result as received from service', async () => {
      // Arrange
      const query = { startNode: 1, endNode: 1 };
      const expectedResult = {
        nodes: [],
        edges: [],
        edgeTypes: [],
        nodeTypes: [],
      };

      jest
        .spyOn(mockService, 'executeQuery')
        .mockImplementation(() => Promise.resolve(expectedResult));

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(200, expectedResult);
    });

    it('Calls service correctly', async () => {
      // Arrange
      const query = { startNode: 1, endNode: 1 };
      jest.spyOn(mockService, 'executeQuery').mockImplementation(() =>
        Promise.resolve({
          nodes: [],
          edges: [],
          edgeTypes: [],
          nodeTypes: [],
        })
      );

      // Act
      await request(app.getHttpServer()).post(`${baseUrl}/query`).send(query);

      // Assert
      expect(mockService.executeQuery).toBeCalledWith(query);
    });

    it('should fail when called without query', async () => {
      // Arrange
      // -

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        // Assert
        .expect(400);
    });

    it('should fail when called with invalid node filter', async () => {
      // Arrange
      const query = {
        startNode: 1,
        endNode: 1,
        filters: {
          nodes: { rule: 'unknown' },
        },
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(400);
    });

    it('should fail when called with invalid edge filter', async () => {
      // Arrange
      const query = {
        startNode: 1,
        endNode: 1,
        filters: {
          edges: { rule: 'unknown' },
        },
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(400);
    });

    it('should fail when called without start node', async () => {
      // Arrange
      const query = {
        endNode: 1,
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(400);
    });

    it('should fail when called without end node', async () => {
      // Arrange
      const query = {
        startNode: 1,
      };

      // Act
      await request(app.getHttpServer())
        .post(`${baseUrl}/query`)
        .send(query)
        // Assert
        .expect(400);
    });
  });
});
