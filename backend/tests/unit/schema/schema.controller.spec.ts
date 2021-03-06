import { Test, TestingModule } from '@nestjs/testing';
import { FactoryProvider, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SchemaController } from '../../../src/schema/schema.controller';
import { SchemaService } from '../../../src/schema/schema.service';

describe('SchemaController', () => {
  let app: INestApplication;

  // Global setup
  beforeEach(async () => {
    const SchemaServiceMock: FactoryProvider = {
      provide: SchemaService,
      useFactory: () => ({
        getEdgeTypes: jest.fn(() => []),
        getNodeTypes: jest.fn(() => []),
        getNodeTypeConnectionInformation: jest.fn(() => []),
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SchemaController],
      providers: [SchemaServiceMock],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  // Global teardown
  afterEach(async () => {
    await app.close();
  });

  describe('getEntityTypes', () => {
    const baseUrl = '/schema';

    describe('successful requests', () => {
      it('should not fail when edges queried', async () => {
        // Act
        await request(app.getHttpServer())
          .get(`${baseUrl}/edge-types`)
          // Assert
          .expect(200);
      });

      it('should not fail when nodes queried', async () => {
        // Act
        await request(app.getHttpServer())
          .get(`${baseUrl}/node-types`)
          // Assert
          .expect(200);
      });

      it('should not fail when node type connections info queried', async () => {
        // Act
        await request(app.getHttpServer())
          .get(`${baseUrl}/node-type-connection-info`)
          // Assert
          .expect(200);
      });
    });
  });
});
