import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { AppService } from '../../src/app.service';
import {
  getEdgesByIdDummies,
  getNodesByIdDummies,
  queryAllDummies,
  queryAllNoLimitDummies,
} from '../fixtures/testingDumpData';
import { QueryResult } from '../../src/shared/queries';
import { KmapNeo4jModule } from '../../src/config/neo4j/KmapNeo4jModule';
import { Edge, Node } from '../../src/shared/entities';

describe('AppService (e2e)', () => {
  describe('testing-dump', () => {
    let appService: AppService;
    let neo4jService: Neo4jService;

    beforeAll(async () => {
      // Global setup
      const mockAppModule: TestingModule = await Test.createTestingModule({
        imports: [
          KmapNeo4jModule.forRootTesting(
            { disableLosslessIntegers: true },
            7687
          ),
        ],
        providers: [AppService],
      }).compile();

      appService = await mockAppModule.resolve<AppService>(AppService);
      neo4jService = await mockAppModule.resolve(Neo4jService);
    });

    afterAll(async () => {
      // Global teardown
      await neo4jService.getDriver().close();
    });

    describe('Method queryAll', () => {
      it('should return edge and node ids (and from and to for edges) for limit', async () => {
        // Arrange
        const expectedResult = queryAllDummies.queryResult;

        // Act
        const actualResult: QueryResult = await appService.queryAll(
          queryAllDummies.query
        );

        // Assert
        expect(actualResult).toEqual(expectedResult);
      });

      it('should return edge and node ids (and from and to for edges) for no limit', async () => {
        // Arrange
        const expectedResult = queryAllNoLimitDummies.queryResult;

        // Act
        const actualResult: QueryResult = await appService.queryAll();

        // Assert
        expect(actualResult).toEqual(expectedResult);
      });

      describe('Method queryAll for no limit', () => {
        it('should return expected node length for no limit', async () => {
          // Act
          const actualResult: QueryResult = await appService.queryAll();

          // Assert
          expect(actualResult.nodes.length).toEqual(4);
        });

        it('should return expected edge length for no limit', async () => {
          // Act
          const actualResult: QueryResult = await appService.queryAll();

          // Assert
          expect(actualResult.edges.length).toEqual(3);
        });
      });

      it('should return no nodes when called with nodes limited to 0', async () => {
        // Arrange
        const result = await appService.queryAll({ limits: { nodes: 0 } });

        // Act & Assert
        expect(result.nodes.length).toEqual(0);
      });

      it('should return no edges when called with edges limited to 0', async () => {
        // Arrange
        const result = await appService.queryAll({ limits: { edges: 0 } });

        // Act & Assert
        expect(result.edges.length).toEqual(0);
      });
    });

    describe('Method getNodesById', () => {
      it('should return nodes corresponding to ids', async () => {
        // Arrange
        const expectedNodes: Node[] = getNodesByIdDummies.nodes;

        // Act
        const actualNodes: Node[] = await appService.getNodesById(
          getNodesByIdDummies.ids
        );

        // Assert
        expect(actualNodes).toEqual(expectedNodes);
      });
    });

    describe('Method getEdgesById', () => {
      it('should return edges corresponding to ids', async () => {
        // Arrange
        const expectedEdges: Edge[] = getEdgesByIdDummies.edges;

        // Act
        const actualEdges: Edge[] = await appService.getEdgesById(
          getEdgesByIdDummies.ids
        );

        // Assert
        expect(actualEdges).toEqual(expectedEdges);
      });
    });
  });
});
