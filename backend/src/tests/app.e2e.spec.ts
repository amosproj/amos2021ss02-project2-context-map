import { Neo4jModule } from 'nest-neo4j/dist';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AppService } from '../app.service';
import { Node } from '../entities/Node';
import { Edge } from '../entities/Edge';
import {
  queryAllDummies,
  getNodesByIdDummies,
  getEdgesByIdDummies,
} from '../fixtures/testingDumpData';

describe('AppService (e2e)', () => {
  let appService: AppService;

  beforeAll(async () => {
    const mockAppModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, Neo4jModule],
      providers: [AppService],
    }).compile();

    appService = await mockAppModule.resolve<AppService>(AppService);
  });

  it('/POST queryAll', async () => {
    const expectedResult = queryAllDummies.queryResult;

    expect(await appService.queryAll(queryAllDummies.limitQuery)).toEqual(
      expectedResult,
    );
  });

  it('/GET getNodesById', async () => {
    const expectedNodes: Node[] = getNodesByIdDummies.nodes;

    expect(await appService.getNodesById(getNodesByIdDummies.ids)).toEqual(
      expectedNodes,
    );
  });

  it('/GET getEdgesById', async () => {
    const expectedEdges: Edge[] = getEdgesByIdDummies.edges;

    expect(await appService.getEdgesById(getEdgesByIdDummies.ids)).toEqual(
      expectedEdges,
    );
  });
});
