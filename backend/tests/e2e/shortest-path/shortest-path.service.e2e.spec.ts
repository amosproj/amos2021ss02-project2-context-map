import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { ConfigModule } from '@nestjs/config';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { ShortestPathService } from '../../../src/shortest-path/shortest-path.service';
import {
  ShortestPathQuery,
  ShortestPathServiceBase,
} from '../../../src/shortest-path/shortest-path.service.base';
import { Path } from '../../../src/shortest-path/Path';
import { FilterService } from '../../../src/filter/filter.service';
import {
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
  QueryResult,
} from '../../../src/shared/queries';

describe('ShortestPathService', () => {
  let service: ShortestPathServiceBase;
  let neo4jService: Neo4jService;

  const nonExistingNodeId = 100;

  // Global Setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        KmapNeo4jModule.fromEnv({
          disableLosslessIntegers: true,
        }),
      ],
      providers: [ShortestPathService, FilterService],
    }).compile();

    service = module.get(ShortestPathService);
    neo4jService = await module.resolve(Neo4jService);
  });

  // Global teardown
  afterAll(async () => {
    await neo4jService.getDriver().close();
  });

  describe('Method findShortestPath', () => {
    it('returns null if non-existing start node is specified', async () => {
      // Arrange
      // --

      // Act
      const result = await service.findShortestPath(nonExistingNodeId, 1);

      // Assert
      expect(result).toBeNull();
    });

    it('returns null if non-existing end node is specified', async () => {
      // Arrange
      // --

      // Act
      const result = await service.findShortestPath(1, nonExistingNodeId);

      // Assert
      expect(result).toBeNull();
    });

    it('returns null if non-existing but identical start and end nodes are specified', async () => {
      // Arrange
      // --

      // Act
      const result = await service.findShortestPath(
        nonExistingNodeId,
        nonExistingNodeId
      );

      // Assert
      expect(result).toBeNull();
    });

    it('returns single entry result of start node equals end-node', async () => {
      // Arrange
      const expectedResult: Path = {
        nodes: [{ id: 1 }],
        edges: [],
      };

      // Act
      const result = await service.findShortestPath(1, 1);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('returns correct result when path spans multiple nodes', async () => {
      // Arrange
      const expectedResult: Path = {
        nodes: [{ id: 3 }, { id: 0 }],
        edges: [{ id: 2, from: 3, to: 0, cost: 1 }],
      };

      // Act
      const result = await service.findShortestPath(3, 0);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('returns null when there is no path', async () => {
      // Arrange
      // --

      // Act
      const result = await service.findShortestPath(3, 1);

      // Assert
      expect(result).toBeNull();
    });

    it('returns correct result when there is a path only when ignoring edge directions', async () => {
      // Arrange
      const expectedResult: Path = {
        nodes: [{ id: 3 }, { id: 0 }, { id: 1 }],
        edges: [
          { id: 2, from: 3, to: 0, cost: 1 },
          { id: 0, from: 1, to: 0, cost: 1 },
        ],
      };

      // Act
      const result = await service.findShortestPath(3, 1, true);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    // TODO: Test separated subgraphs. That is not possible with the current, very small dataset.
  });

  describe('Method executeQuery', () => {
    it('returns filter-result if no path is found.', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 1,
        filters: {
          nodes: OfTypeCondition('Movie'),
          edges: OfTypeCondition('DoesNotExist'),
        },
      };

      const expectedResult: QueryResult = {
        nodes: [{ id: 0 }],
        edges: [],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('Flags path in query result.', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 0,
        filters: {
          nodes: MatchAnyCondition(
            OfTypeCondition('Movie'),
            MatchPropertyCondition('name', 'Lana Wachowski')
          ),
          edges: OfTypeCondition('DIRECTED'),
        },
      };

      const expectedResult: QueryResult = {
        nodes: [
          { id: 0, isPath: true },
          { id: 3, isPath: true },
        ],
        edges: [{ id: 2, from: 3, to: 0, isPath: true }],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('Adds start node to query result.', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 0,
        filters: {
          nodes: OfTypeCondition('Movie'),
          edges: OfTypeCondition('DoesNotExist'),
        },
      };

      const expectedResult: QueryResult = {
        nodes: [
          { id: 0, isPath: true },
          { id: 3, isPath: true },
        ],
        edges: [{ id: 2, from: 3, to: 0, isPath: true }],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('Adds end node to query result.', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 0,
        filters: {
          nodes: MatchPropertyCondition('name', 'Lana Wachowski'),
          edges: OfTypeCondition('DoesNotExist'),
        },
      };

      const expectedResult: QueryResult = {
        nodes: [
          { id: 3, isPath: true },
          { id: 0, isPath: true },
        ],
        edges: [{ id: 2, from: 3, to: 0, isPath: true }],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('Adds subsidary edge, if required', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 0,
        filters: {
          nodes: MatchAnyCondition(
            OfTypeCondition('Movie'),
            MatchPropertyCondition('name', 'Lana Wachowski')
          ),
          edges: OfTypeCondition('DoesNotExist'),
        },
      };

      const expectedResult: QueryResult = {
        nodes: [
          { id: 0, isPath: true },
          { id: 3, isPath: true },
        ],
        edges: [{ id: 2, from: 3, to: 0, isPath: true, subsidiary: true }],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('Adds subsidary edge in reverse path direction, if required', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 1,
        filters: {
          nodes: MatchAnyCondition(
            OfTypeCondition('Movie'),
            MatchPropertyCondition('name', 'Lana Wachowski'),
            MatchPropertyCondition('name', 'Keanu Reeves')
          ),
          edges: OfTypeCondition('DIRECTED'),
        },
        ignoreEdgeDirections: true,
      };

      const expectedResult: QueryResult = {
        nodes: [
          { id: 0, isPath: true },
          { id: 1, isPath: true },
          { id: 3, isPath: true },
        ],
        edges: [
          { id: 2, from: 3, to: 0, isPath: true },
          { id: 0, from: 1, to: 0, isPath: true, subsidiary: true },
        ],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('Replaced non-included subgraphs with virtual node', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 1,
        filters: {
          nodes: MatchAnyCondition(
            MatchPropertyCondition('name', 'Lana Wachowski'),
            MatchPropertyCondition('name', 'Keanu Reeves')
          ),
          edges: OfTypeCondition('DoesNotExist'),
        },
        // We have to ignore edge directions here, as our test-dataset is not
        // large enough for directed paths with more than 2 nodes :(
        ignoreEdgeDirections: true,
      };

      // Query result should be:
      // (1)  (3)

      // Path should be:
      // (3) -2-> (0) <-0- (1)

      // Replace node (0) and edges (0, 2) with virtual ones:
      // (3) -v_1-> (v_1) <-v_2- (1)

      const expectedResult: QueryResult = {
        nodes: [
          { id: 1, isPath: true },
          { id: 3, isPath: true },
          { id: -1, isPath: true, virtual: true },
        ],
        edges: [
          { id: -1, from: 3, to: -1, isPath: true, virtual: true },
          { id: -2, from: 1, to: -1, isPath: true, virtual: true },
        ],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('Returns only start and end node when filter result is empty and path spans only two nodes', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 0,
        filters: {
          nodes: OfTypeCondition('DoesNotExist'),
          edges: OfTypeCondition('DoesNotExist'),
        },
      };

      const expectedResult: QueryResult = {
        nodes: [
          { id: 3, isPath: true },
          { id: 0, isPath: true },
        ],
        edges: [{ id: 2, from: 3, to: 0, isPath: true }],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('Returns minimal result with start node, virtual node and end node if filter result is empty and path spans more than two nodes', async () => {
      // Arrange
      const query: ShortestPathQuery = {
        startNode: 3,
        endNode: 1,
        filters: {
          nodes: OfTypeCondition('DoesNotExist'),
          edges: OfTypeCondition('DoesNotExist'),
        },
        // We have to ignore edge directions here, as our test-dataset is not
        // large enough for directed paths with more than 2 nodes :(
        ignoreEdgeDirections: true,
      };

      // Query result should be:
      // --None--

      // Path should be:
      // (3) -2-> (0) <-0- (1)

      // Replace node (0) and edges (0, 2) with virtual ones:
      // (3) -v_1-> (v_1) <-v_2- (1)

      const expectedResult: QueryResult = {
        nodes: [
          { id: 3, isPath: true },
          { id: 1, isPath: true },
          { id: -1, isPath: true, virtual: true },
        ],
        edges: [
          { id: -1, from: 3, to: -1, isPath: true, virtual: true },
          { id: -2, from: 1, to: -1, isPath: true, virtual: true },
        ],
      };

      // Act
      const result = await service.executeQuery(query);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
