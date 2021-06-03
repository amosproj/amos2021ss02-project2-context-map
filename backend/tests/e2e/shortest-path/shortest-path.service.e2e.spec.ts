import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { ConfigModule } from '@nestjs/config';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { ShortestPathService } from '../../../src/shortest-path/shortest-path.service';
import { ShortestPathServiceBase } from '../../../src/shortest-path/shortest-path.service.base';
import { Path } from '../../../src/shortest-path/Path';

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
      providers: [ShortestPathService],
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
        edges: [{ id: 2, from: 3, to: 0 }],
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
          { id: 2, from: 3, to: 0 },
          { id: 0, from: 0, to: 1 },
        ],
      };

      // Act
      const result = await service.findShortestPath(3, 1, true);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    // TODO: Test separated subgraphs. That is not possible with the current, very small dataset.
  });
});
