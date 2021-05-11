import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AppService } from '../../src/app.service';
import { Node } from '../../src/entities/Node';
import { Edge } from '../../src/entities/Edge';
import {
  getEdgesByIdDummies,
  getNodesByIdDummies,
  queryAllDummies,
  queryAllNoLimitDummies,
} from '../fixtures/testingDumpData';
import { QueryResult } from '../../src/entities/queries/QueryResult';
import { KmapNeo4jModule } from '../../src/config/neo4j/KmapNeo4jModule';
import { Neo4jService } from 'nest-neo4j/dist';

describe('AppService (e2e)', () => {
  let appService: AppService;
  let neo4jService: Neo4jService;

  beforeAll(async () => {
    // Global setup
    const mockAppModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KmapNeo4jModule],
      providers: [AppService],
    }).compile();

    appService = await mockAppModule.resolve<AppService>(AppService);
    neo4jService = await mockAppModule.resolve(Neo4jService);
  });

  afterAll(async () => {
    await neo4jService.getDriver().close();
  });

  describe('Method queryAll', () => {
    it('should return edge and node ids (and from and to for edges)', async () => {
      // Arrange
      const expectedResult = queryAllDummies.queryResult;

      // Act
      const actualResult: QueryResult = await appService.queryAll(
        queryAllDummies.limitQuery,
      );

      // Assert
      expect(actualResult).toEqual(expectedResult);
    });

    it('should return edge and node ids (and from and to for edges)', async () => {
      // Arrange
      const expectedResult = queryAllNoLimitDummies.queryResult;

      // Act
      const actualResult: QueryResult = await appService.queryAll();

      // Assert
      expect(actualResult).toEqual(expectedResult);
    });

    it('should return no nodes when called with nodes limited to 0', async () => {
      const result = await appService.queryAll({ limit: { nodes: 0 } });
      expect(result.nodes.length).toEqual(0);
    });

    it('should return no edges when called with edges limited to 0', async () => {
      const result = await appService.queryAll({ limit: { edges: 0 } });
      expect(result.edges.length).toEqual(0);
    });
  });

  describe('Method getNodesById', () => {
    it('should return nodes corresponding to ids', async () => {
      // Arrange
      const expectedNodes: Node[] = getNodesByIdDummies.nodes;

      // Act
      const actualNodes: Node[] = await appService.getNodesById(
        getNodesByIdDummies.ids,
      );

      // Assert
      expect(actualNodes).toEqual(expectedNodes);
    });
  });

  describe('Method getEdgesById', () => {
    it('should return edges corresponding to ids', async () => {
      const expectedEdges: Edge[] = getEdgesByIdDummies.edges;

      // Act
      const actualEdges: Edge[] = await appService.getEdgesById(
        getEdgesByIdDummies.ids,
      );

      // Assert
      expect(actualEdges).toEqual(expectedEdges);
    });
  });
});
