import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { QueryResult } from "./entities/queries/QueryResult";
import { TestingDumpData } from "./fixtures/testingDumpData";
import { Neo4jModule} from "nest-neo4j/dist";
import { AppModule } from "./app.module";
import { Node } from "./entities/Node";
import { Edge } from "./entities/Edge";

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, Neo4jModule],
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
  });

  describe("queryAll", () => {
    it("should return edge and node ids (and from and to for edges)", async () => {
      const result: QueryResult = {
        nodes: TestingDumpData.nodeIds,
        edges: TestingDumpData.edgeIds
      };

      jest.spyOn(appService, 'queryAll').mockImplementation(() => Promise.resolve(result));

      expect(await appController.queryAll(TestingDumpData.limitQuery)).toBe(result);
    });
  });

  describe("getNodesById", () => {
    it("should return nodes", async () => {
      const result: Node[] = TestingDumpData.nodes;

      jest.spyOn(appService, 'getNodesById').mockImplementation(() => Promise.resolve(result));

      expect(await appController.getNodesById([1, 2, 3])).toBe(result);
    });
  });

  describe("getEdgesById", () => {
    it("should return nodes", async () => {
      const result: Edge[] = TestingDumpData.edges;

      jest.spyOn(appService, 'getEdgesById').mockImplementation(() => Promise.resolve(result));

      expect(await appController.getEdgesById([1, 2])).toBe(result);
    });
  });
});
