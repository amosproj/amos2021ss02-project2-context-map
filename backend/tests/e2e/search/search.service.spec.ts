import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { SearchService } from '../../../src/search/search.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { AppModule } from '../../../src/app.module';

describe('SearchService', () => {
  let service: SearchService;
  let neo4jService: Neo4jService;

  // Global Setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KmapNeo4jModule],
      providers: [SearchService],
    }).compile();

    service = module.get<SearchService>(SearchService);
    neo4jService = await module.resolve(Neo4jService);
  });

  // Global teardown
  afterAll(async () => {
    await neo4jService.getDriver().close();
  });

  describe('Method search', () => {
    it('finds single node by property', async () => {
      // Act
      const result = await service.search('lana');
      // Assert
      expect(result).toEqual({'edges': [], 'nodes': [{'id': 3}]});
    });

    it('finds nodes by type', async () => {
      // Act
      const result = await service.search('person');
      // Assert
      expect(result).toEqual({'edges': [], 'nodes': [{'id': 3}, {'id': 2}, {'id': 1}]});
    });

    it('finds edges by entity type', async () => {
      // Arrange
      const expected = {
        'edges': [
          {
            'from': 3,
            'id': 2,
            'to': 0,
            },
          {
            'from': 2,
            'id': 1,
            'to': 0,
          },
          {
            'from': 1,
            'id': 0,
            'to': 0,
          }
        ],
        'nodes': [],
      };

      // Act
      const result = await service.search('edge');

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
