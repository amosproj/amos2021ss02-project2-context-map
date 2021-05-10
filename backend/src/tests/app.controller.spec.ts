import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { QueryResult } from '../entities/queries/QueryResult';
import { Node } from '../entities/Node';
import { Edge } from '../entities/Edge';
import * as request from 'supertest';
import {
  queryAllDummies,
  getNodesByIdDummies,
  getEdgesByIdDummies,
} from '../fixtures/testingDumpData';
import { INestApplication } from '@nestjs/common';

describe('AppController', () => {
  let app: INestApplication;
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
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

  describe('queryAll', () => {
    it('should return edge and node ids (and from and to for edges)', async () => {
      const result: QueryResult = queryAllDummies.queryResult;

      jest.spyOn(appService, 'queryAll').mockImplementation(() => {
        return Promise.resolve(result);
      });

      return request(app.getHttpServer())
        .post('/queryAll')
        .send(queryAllDummies.limitQuery)
        .expect(201, result);
    });
  });

  describe('getNodesById', () => {
    it('should return nodes', async () => {
      const result: Node[] = getNodesByIdDummies.nodes;

      jest.spyOn(appService, 'getNodesById').mockImplementation(() => {
        return Promise.resolve(result);
      });

      return request(app.getHttpServer())
        .get('/getNodesById?ids=1&ids=2&ids=3')
        .expect(200, result);
    });
  });

  describe('getEdgesById', () => {
    it('should return nodes', async () => {
      const result: Edge[] = getEdgesByIdDummies.edges;

      jest.spyOn(appService, 'getEdgesById').mockImplementation(() => {
        return Promise.resolve(result);
      });

      return request(app.getHttpServer())
        .get('/getEdgesById?ids=1&ids=2')
        .expect(200, result);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
