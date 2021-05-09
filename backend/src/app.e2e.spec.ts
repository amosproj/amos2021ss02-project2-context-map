import { Neo4jModule} from "nest-neo4j/dist";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { AppService } from "./app.service";
import { Node } from "./entities/Node";
import * as request from 'supertest';

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let appService: AppService;

  beforeAll(async () => {
    const mockAppModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, Neo4jModule.forRoot({
        scheme: 'neo4j',
        host: 'localhost',
        port: 7687,
        username: 'neo4j',
        password: 'amos'
      })],
      providers: [AppService]
    }).compile();

    app = mockAppModule.createNestApplication();
    appService = await mockAppModule.resolve<AppService>(AppService);
    await app.init();
  });

  it('/GET getNodesById', async () => {
    const expectedValue = await appService.getNodesById([1]);

    const nodes: Node[] =  [
      {
        id: 1,
        labels: [ 'Person' ],
        properties: { born: 1964, name: 'Keanu Reeves' }
      },
      {
        id: 2,
        labels: [ 'Person' ],
        properties: { born: 1967, name: 'Carrie-Anne Moss' }
      },
      {
        id: 3,
        labels: [ 'Person' ],
        properties: { born: 1965, name: 'Lana Wachowski' }
      }
    ];

    return request(app.getHttpServer())
      .get('/getNodesById?ids[]=1&ids[]=2&ids[]=3')
      .expect(nodes)
      .expect(expectedValue);
  });
});

