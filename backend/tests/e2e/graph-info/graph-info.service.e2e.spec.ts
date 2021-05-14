import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { SchemaService } from '../../../src/schema/schema.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { AppModule } from '../../../src/app.module';
import { edgeInfo, nodeInfo } from '../../fixtures/nodeInfo/GraphInfoDb';

/*
Tests graph-info.spec.ts
Tests parseNeo4jEntityInfo indirectly
 */
describe('GraphInfoService', () => {
  let service: SchemaService;
  let neo4jService: Neo4jService;

  // Global Setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KmapNeo4jModule],
      providers: [],
    }).compile();

    service = module.get<SchemaService>(SchemaService);
    neo4jService = await module.resolve(Neo4jService);
  });

  // Global teardown
  afterAll(async () => {
    await neo4jService.getDriver().close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Method getEntityTypes', () => {
    it('should return nodes-info when requested', async () => {
      // Act
      const result = await service.getNodeTypes();
      // Assert
      expect(result).toEqual(nodeInfo.expected);
    });

    it('should return edges-info when requested', async () => {
      // Act
      const result = await service.getEdgeTypes();
      // Assert
      expect(result).toEqual(edgeInfo.expected);
    });
  });
});
