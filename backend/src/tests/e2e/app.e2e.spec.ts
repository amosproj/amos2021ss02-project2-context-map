import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { AppService } from '../../app.service';
import { Node } from '../../entities/Node';
import { Edge } from '../../entities/Edge';
import {
  queryAllDummies,
  getNodesByIdDummies,
  getEdgesByIdDummies,
} from '../../fixtures/testingDumpData';
import { QueryResult } from '../../entities/queries/QueryResult';
import { KmapNeo4jModule } from '../../config/neo4j/KmapNeo4jModule';

describe('AppService (e2e)', () => {
  let appService: AppService;

  beforeAll(async () => {
    // Global setup
    const mockAppModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KmapNeo4jModule],
      providers: [AppService],
    }).compile();

    appService = await mockAppModule.resolve<AppService>(AppService);
  });

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
