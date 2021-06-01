import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { SearchService } from '../../../src/search/search.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { AppModule } from '../../../src/app.module';
import { SearchIndexBuilder } from '../../../src/search/SearchIndexBuilder';

describe('SearchService', () => {
  let service: SearchService;
  let neo4jService: Neo4jService;

  // Global Setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KmapNeo4jModule],
      providers: [SearchService, SearchIndexBuilder],
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
      const expected = {
        edges: [],
        nodes: [{ id: 3 }],
        nodeTypes: [],
        edgeTypes: [],
      };

      // Act
      const result = await service.search('lana');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds single node by property stub', async () => {
      // Arrange
      const expected = {
        edges: [],
        nodes: [{ id: 1 }],
        nodeTypes: [],
        edgeTypes: [],
      };

      // Act
      const result = await service.search('reev');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds nodes and node type by type', async () => {
      // Arrange
      const expected = {
        edges: [],
        nodes: [{ id: 3 }, { id: 2 }, { id: 1 }],
        nodeTypes: [
          {
            name: 'Person',
          },
        ],
        edgeTypes: [],
      };

      // Act
      const result = await service.search('person');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds nodes and node type by type stub', async () => {
      // Arrange
      const expected = {
        edges: [],
        nodes: [{ id: 3 }, { id: 2 }, { id: 1 }],
        nodeTypes: [
          {
            name: 'Person',
          },
        ],
        edgeTypes: [],
      };

      // Act
      const result = await service.search('pers');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds nodes and node-types by node type', async () => {
      // Arrange
      const expected = {
        edges: [],
        nodes: [
          {
            id: 3,
          },
          {
            id: 2,
          },
          {
            id: 1,
          },
          {
            id: 0,
          },
        ],
        nodeTypes: [
          {
            name: 'Movie',
          },
          {
            name: 'Person',
          },
        ],
        edgeTypes: [],
      };

      // Act
      const result = await service.search('node');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds edges and edge types by entity type', async () => {
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
        nodeTypes: [],
        edgeTypes: [
          {
            name: 'DIRECTED',
          },
          {
            name: 'ACTED_IN',
          },
        ],
      };

      // Act
      const result = await service.search('edge');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds edges and edge type by type', async () => {
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
        nodeTypes: [],
        edgeTypes: [
          {
            name: 'DIRECTED',
          },
        ],
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
        nodeTypes: [],
        edgeTypes: [],
      };

      // Act
      const result = await service.search('trinity');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds single edge by property stub', async () => {
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
        nodeTypes: [],
        edgeTypes: [],
      };

      // Act
      const result = await service.search('trini');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds edge types by property name', async () => {
      // Arrange
      const expected = {
        edges: [],
        nodes: [],
        nodeTypes: [],
        edgeTypes: [
          {
            name: 'ACTED_IN',
          },
        ],
      };

      // Act
      const result = await service.search('roles');

      // Assert
      expect(result).toEqual(expected);
    });

    it('finds node types by property name', async () => {
      // Arrange
      const expected = {
        edges: [],
        nodes: [],
        nodeTypes: [
          {
            name: 'Movie',
          },
        ],
        edgeTypes: [],
      };

      // Act
      const result = await service.search('released');

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('Method autosuggestion', () => {
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
