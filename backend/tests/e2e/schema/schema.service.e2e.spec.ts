import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { ConfigModule } from '@nestjs/config';
import { SchemaService } from '../../../src/schema/schema.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { edgeInfo, nodeInfo } from '../../fixtures/nodeInfo/GraphInfoDb';

/*
Tests schema.service.ts
Tests parseNeo4jEntityInfo indirectly
 */
describe('SchemaService', () => {
  let service: SchemaService;
  let neo4jService: Neo4jService;

  // Global Setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        KmapNeo4jModule.fromEnv({
          disableLosslessIntegers: true,
        }),
      ],
      providers: [SchemaService],
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

  describe('Method getEntityConnectionInfo', () => {
    it('should return entry for each possible connection (cross product)', async () => {
      const numNodeTypes = 2;
      const result = await service.getNodeTypeConnectionInformation();
      expect(result).toHaveLength(numNodeTypes ** 2);
    });

    it('should return correct connections', async () => {
      const result = await service.getNodeTypeConnectionInformation();
      const personToMovie = result.filter(
        (r) => r.from === 'Person' && r.to === 'Movie'
      );
      expect(personToMovie).toHaveLength(1);
      expect(personToMovie[0].numConnections).toBe(3);
    });
  });
});
