import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { QueryResult } from '../../entities/queries/QueryResult';
import { Node } from '../../entities/Node';
import { Edge } from '../../entities/Edge';
import * as request from 'supertest';
import {
  getEdgesByIdDummies,
  getNodesByIdDummies,
  queryAllDummies,
} from '../fixtures/testingDumpData';
import { FactoryProvider, INestApplication } from '@nestjs/common';

const notImplemented = () => {
  throw 'Not implemented';
};

describe('AppController', () => {
  let app: INestApplication;
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    // Global setup
    const AppServiceProvider: FactoryProvider = {
      provide: AppService,
      useFactory: () => ({
        queryAll: jest.fn(notImplemented),
        getNodesById: jest.fn(notImplemented),
        getEdgesById: jest.fn(notImplemented),
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppServiceProvider],
    }).compile();

    app = moduleRef.createNestApplication();
    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
    await app.init();
  });

  afterEach(async () => {
    // Global teardown
    await app.close();
  });

  describe('queryAll', () => {
    it('should return QueryResult with limits from the LimitQuery-Body ', async () => {
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
        .send(queryAllDummies.limitQuery)
        // Expect this HttpCode and result
        .expect(200, result);

      // Mock must have been called with the QueryResult sent in the body
      expect(queryAll).toBeCalledWith(queryAllDummies.limitQuery);
    });

    it('should not fail without body', async () => {
      // Mock
      const queryAll = jest
        .spyOn(appService, 'queryAll')
        .mockImplementation(() => Promise.resolve(null));

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
      expect(getNodesById).toBeCalledWith([1, 2, 3]);
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

      expect(getEdgesById).toBeCalledWith([1, 2]);
    });
  });
});
