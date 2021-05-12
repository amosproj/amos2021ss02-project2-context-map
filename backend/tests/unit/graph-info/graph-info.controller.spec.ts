import { Test, TestingModule } from '@nestjs/testing';
import { FactoryProvider, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GraphInfoController } from '../../../src/graph-info/graph-info.controller';
import { GraphInfoService } from '../../../src/graph-info/graph-info.service';

describe('GraphInfoController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // Global setup
    const GraphInfoServiceMock: FactoryProvider = {
      provide: GraphInfoService,
      useFactory: () => ({
        getEdgeTypes: jest.fn(() => []),
        getNodeTypes: jest.fn(() => []),
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [GraphInfoController],
      providers: [GraphInfoServiceMock],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // Global teardown
    await app.close();
  });

  describe('getEntityTypes', () => {
    const baseUrl = '/graphInfo';

    describe('successful requests', () => {
      it('should return edge information', async () => {
        await request(app.getHttpServer())
          .get(`${baseUrl}/getEdgeTypes`)
          .expect(200);
      });

      it('should return node information', async () => {
        await request(app.getHttpServer())
          .get(`${baseUrl}/getNodeTypes`)
          .expect(200);
      });
    });
  });
});
