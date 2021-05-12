import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { GraphInfoService } from '../../../src/graph-info/graph-info.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { AppModule } from '../../../src/app.module';
import { edgeInfo, nodeInfo } from '../../fixtures/nodeInfo/GraphInfoDb';

/*
Tests graph-info.spec.ts
Tests parseNeo4jEntityInfo indirectly
 */
describe('GraphInfoService', () => {
  let service: GraphInfoService;
  let neo4jService: Neo4jService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KmapNeo4jModule],
      providers: [],
    }).compile();

    service = module.get<GraphInfoService>(GraphInfoService);
    neo4jService = await module.resolve(Neo4jService);
  });

  afterAll(async () => {
    // Global teardown
    await neo4jService.getDriver().close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Method getEntityTypes', () => {
    it('should return nodes-info when requested', async () => {
      const result = await service.getEntityTypes('node');
      expect(result).toEqual(nodeInfo.expected);
    });

    it('should return edges-info when requested', async () => {
      const result = await service.getEntityTypes('rel');
      expect(result).toEqual(edgeInfo.expected);
    });
  });
});
