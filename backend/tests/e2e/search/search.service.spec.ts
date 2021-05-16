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
      // Arrange
      const expected = { edges: [], nodes: [{ id: 3 }] };

      // Act
      const result = await service.search('lana');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds nodes by type', async () => {
      // Arrange
      const expected = { edges: [], nodes: [{ id: 3 }, { id: 2 }, { id: 1 }] };

      // Act
      const result = await service.search('person');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds edges by entity type', async () => {
      // Arrange
      const expected = {
        edges: [
          {
            from: 3,
            id: 2,
            to: 0,
          },
          {
            from: 2,
            id: 1,
            to: 0,
          },
          {
            from: 1,
            id: 0,
            to: 0,
          },
        ],
        nodes: [],
      };

      // Act
      const result = await service.search('edge');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds single edge by type', async () => {
      // Arrange
      const expected = {
        edges: [
          {
            from: 3,
            id: 2,
            to: 0,
          },
        ],
        nodes: [],
      };

      // Act
      const result = await service.search('directed');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds single edge by property', async () => {
      // Arrange
      const expected = {
        edges: [
          {
            from: 2,
            id: 1,
            to: 0,
          },
        ],
        nodes: [],
      };

      // Act
      const result = await service.search('trinity');

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('Method autosuggest', () => {
    it('finds autosuggestion by edge property', async () => {
      // Arrange
      const expected = ['trinity'];

      // Act
      const result = await service.getAutoSuggestions('trin');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds autosuggestion by edge entity type', async () => {
      // Arrange
      const expected = ['edge'];

      // Act
      const result = await service.getAutoSuggestions('edg');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds autosuggestion by node entity type', async () => {
      // Arrange
      const expected = ['node'];

      // Act
      const result = await service.getAutoSuggestions('nod');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds autosuggestion by edge type', async () => {
      // Arrange
      const expected = ['directed'];

      // Act
      const result = await service.getAutoSuggestions('dir');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds autosuggestion by node type', async () => {
      // Arrange
      const expected = ['person'];

      // Act
      const result = await service.getAutoSuggestions('pers');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds autosuggestion by node property', async () => {
      // Arrange
      const expected = ['matrix'];

      // Act
      const result = await service.getAutoSuggestions('matr');

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
