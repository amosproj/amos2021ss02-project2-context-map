import { Neo4jModule } from "nest-neo4j/dist";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { AppService } from "./app.service";
import { Node } from "./entities/Node";
import * as request from "supertest";
import { TestingDumpData } from "./fixtures/testingDumpData";
import { Edge } from "./entities/Edge";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let appService: AppService;

  beforeAll(async () => {
    const mockAppModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, Neo4jModule.forRoot({
        scheme: "neo4j",
        host: "localhost",
        port: 7687,
        username: "neo4j",
        password: "amos"
      })],
      providers: [AppService]
    }).compile();

    app = mockAppModule.createNestApplication();
    appService = await mockAppModule.resolve<AppService>(AppService);
    await app.init();
  });

  it("/GET queryAll", async () => {
    const expectedFromService = await appService.queryAll(TestingDumpData.limitQuery);

    const expectedResult = {
      edges: TestingDumpData.edgeIds,
      nodes: TestingDumpData.nodeIds
    };

    return request(app.getHttpServer())
      .post("/queryAll")
      .send({ limit: { nodes: 3, edges: 4 } })
      .expect(expectedResult)
      .expect(expectedFromService);
  });

  it("/GET getNodesById", async () => {
    const expectedFromService = await appService.getNodesById([1, 2, 3]);

    const expectedNodes: Node[] = TestingDumpData.nodes;

    return request(app.getHttpServer())
      .get("/getNodesById?ids[]=1&ids[]=2&ids[]=3")
      .expect(expectedNodes)
      .expect(expectedFromService);
  });

  it("/GET getEdgesById", async () => {
    const expectedFromService = await appService.getEdgesById([1, 2]);

    const expectedEdges: Edge[] = TestingDumpData.edges;

    return request(app.getHttpServer())
      .get("/getEdgesById?ids[]=1&ids[]=2")
      .expect(expectedEdges)
      .expect(expectedFromService);
  });

  afterAll(async () => {
    await app.close();
  });
});

