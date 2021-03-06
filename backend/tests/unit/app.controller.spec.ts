import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { FactoryProvider, INestApplication } from '@nestjs/common';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import { QueryResult } from '../../src/shared/queries';
import { Node, Edge } from '../../src/shared/entities';
import {
  getEdgesByIdDummies,
  getNodesByIdDummies,
  queryAllDummies,
} from '../fixtures/testingDumpData';
import { notImplemented } from './notImplemented';

describe('AppController', () => {
  let app: INestApplication;
  let appService: AppService;

  beforeEach(async () => {
    // Global setup
    const AppServiceProvider: FactoryProvider = {
      provide: AppService,
      useFactory: () => ({
        queryAll: jest.fn(notImplemented),
        getNodesById: jest.fn(notImplemented),
        getEdgesById: jest.fn(notImplemented),
        getNumberOfEntities: jest.fn(notImplemented),
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppServiceProvider],
    }).compile();

    app = moduleRef.createNestApplication();
    appService = moduleRef.get<AppService>(AppService);
    await app.init();
  });

  afterEach(async () => {
    // Global teardown
    await app.close();
  });

  describe('queryAll', () => {
    it('should return QueryResult with limits from the QueryBase-Body ', async () => {
      // Arrange
      const result: QueryResult = queryAllDummies.queryResult;

      // Mock
      const queryAll = jest
        .spyOn(appService, 'queryAll')
        .mockImplementation(() => Promise.resolve(result));

      // Act & Verify
      await request(app.getHttpServer())
        // Query that address
        .post('/queryAll')
        // Send this in the body
        .send(queryAllDummies.query)
        // Expect this HttpCode and result
        .expect(200, result);

      // Mock must have been called with the QueryResult sent in the body
      expect(queryAll).toBeCalledWith(queryAllDummies.query);
    });

    it('should not fail without body', async () => {
      // Mock
      const queryAll = jest
        .spyOn(appService, 'queryAll')
        .mockImplementation(() => Promise.resolve({ edges: [], nodes: [] }));

      // Act & Verify
      await request(app.getHttpServer()).post('/queryAll').expect(200);

      expect(queryAll).toBeCalled();
    });
  });

  describe('getNodesById', () => {
    it('should GET nodes corresponding to ids', async () => {
      // Arrange
      const result: Node[] = getNodesByIdDummies.nodes;

      const getNodesById = jest
        .spyOn(appService, 'getNodesById')
        .mockImplementation(() => Promise.resolve(result));

      // Act & Assert
      await request(app.getHttpServer())
        .get('/getNodesById?ids=1&ids=2&ids=3')
        .expect(200, result);

      // Assert mock called with parameter from the query params
      expect(getNodesById).toBeCalledWith(getNodesByIdDummies.ids);
    });
  });

  describe('getEdgesById', () => {
    it('should GET edges corresponding to ids', async () => {
      // Arrange
      const result: Edge[] = getEdgesByIdDummies.edges;

      const getEdgesById = jest
        .spyOn(appService, 'getEdgesById')
        .mockImplementation(() => Promise.resolve(result));

      // Act & Assert
      await request(app.getHttpServer())
        .get('/getEdgesById?ids=1&ids=2')
        .expect(200, result);

      expect(getEdgesById).toBeCalledWith(getEdgesByIdDummies.ids);
    });
  });

  describe('getNumberOfEntities', () => {
    it('should return what the service provides', async () => {
      // Arrange
      const result = { edges: 20, nodes: 25 };

      const getEdgesById = jest
        .spyOn(appService, 'getNumberOfEntities')
        .mockImplementation(() => Promise.resolve(result));

      // Act & Assert
      await request(app.getHttpServer())
        .get('/getNumberOfEntities')
        .expect(200, result);

      expect(getEdgesById).toBeCalledWith();
    });
  });
});
