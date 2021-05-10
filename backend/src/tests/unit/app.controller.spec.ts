import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { QueryResult } from '../../entities/queries/QueryResult';
import { Node } from '../../entities/Node';
import { Edge } from '../../entities/Edge';
import * as request from 'supertest';
import {
  queryAllDummies,
  getNodesByIdDummies,
  getEdgesByIdDummies,
} from '../../fixtures/testingDumpData';
import { INestApplication } from '@nestjs/common';

describe('AppController', () => {
  let app: INestApplication;
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    // Global setup
    const AppServiceProvider = {
      provide: AppService,
      useFactory: () => ({
        queryAll: jest.fn(),
        getNodesById: jest.fn(),
        getEdgesById: jest.fn(),
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
    it('should POST edge and node ids (and from and to for edges) with limit', async () => {
      // Arrange
      const result: QueryResult = queryAllDummies.queryResult;

      jest
        .spyOn(appService, 'queryAll')
        .mockImplementation(() => Promise.resolve(result));

      // Act
      const respond: request.Test = request(app.getHttpServer())
        .post('/queryAll')
        .send(queryAllDummies.limitQuery);

      // Assert
      return respond.expect(201, result);
    });
  });

  describe('getNodesById', () => {
    it('should GET nodes corresponding to ids', async () => {
      // Arrange
      const result: Node[] = getNodesByIdDummies.nodes;

      jest
        .spyOn(appService, 'getNodesById')
        .mockImplementation(() => Promise.resolve(result));

      // Act
      const respond: request.Test = request(app.getHttpServer()).get(
        '/getNodesById?ids=1&ids=2&ids=3',
      );

      // Assert
      return respond.expect(200, result);
    });
  });

  describe('getEdgesById', () => {
    it('should GET edges corresponding to ids', async () => {
      // Arrange
      const result: Edge[] = getEdgesByIdDummies.edges;

      jest
        .spyOn(appService, 'getEdgesById')
        .mockImplementation(() => Promise.resolve(result));

      // Act
      const respond: request.Test = request(app.getHttpServer()).get(
        '/getEdgesById?ids=1&ids=2',
      );

      // Assert
      return respond.expect(200, result);
    });
  });
});
