import { Test, TestingModule } from '@nestjs/testing';
import { FactoryProvider, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SchemaController } from '../../../src/schema/schema.controller';
import { SchemaService } from '../../../src/schema/schema.service';

describe('GraphInfoController', () => {
  let app: INestApplication;

  // Global setup
  beforeEach(async () => {
    const GraphInfoServiceMock: FactoryProvider = {
      provide: SchemaService,
      useFactory: () => ({
        getEdgeTypes: jest.fn(() => []),
        getNodeTypes: jest.fn(() => []),
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SchemaController],
      providers: [GraphInfoServiceMock],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  // Global teardown
  afterEach(async () => {
    await app.close();
  });

  describe('getEntityTypes', () => {
    const baseUrl = '/graphInfo';

    describe('successful requests', () => {
      it('should not fail when edges queried', async () => {
        // Act
        await request(app.getHttpServer())
          .get(`${baseUrl}/getEdgeTypes`)
          // Assert
          .expect(200);
      });

      it('should not fail when nodes queried', async () => {
        // Act
        await request(app.getHttpServer())
          .get(`${baseUrl}/getNodeTypes`)
          // Assert
          .expect(200);
      });
    });
  });
});
