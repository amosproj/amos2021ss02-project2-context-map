import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from 'nest-neo4j/dist';
import { SearchService } from '../../../src/search/search.service';
import { KmapNeo4jModule } from '../../../src/config/neo4j/KmapNeo4jModule';
import { AppModule } from '../../../src/app.module';
import { SchemaService } from '../../../src/schema/schema.service';

describe('SearchService', () => {
  let service: SearchService;
  let neo4jService: Neo4jService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KmapNeo4jModule],
      providers: [SearchService, SchemaService],
    }).compile();

    service = module.get<SearchService>(SearchService);
    neo4jService = await module.resolve(Neo4jService);
  });

  afterEach(async () => {
    await neo4jService.getDriver().close();
  });

  describe('Method searchInEdgeProperties', () => {
    it('should filter', async () => {
      await expect(
        service.searchInEdgeProperties('Neo')
      ).resolves.toMatchObject([{ from: 1, id: 0, to: 0 }]);
    });

    it('should filter case insensitive', async () => {
      await expect(
        service.searchInEdgeProperties('neo')
      ).resolves.toMatchObject([{ from: 1, id: 0, to: 0 }]);
    });

    it('should use cached query', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any -- ignore that method is private */
      const spy = jest.spyOn(service as any, 'loadEdgeFulltextQuery');

      await service.searchInEdgeProperties('nothing');
      await service.searchInEdgeProperties('nothing');

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('Method searchInNodeProperties', () => {
    it('should filter', async () => {
      await expect(
        service.searchInNodeProperties('Keanu')
      ).resolves.toMatchObject([{ id: 1 }]);
    });

    it('should filter case insensitive', async () => {
      await expect(
        service.searchInNodeProperties('keanu')
      ).resolves.toMatchObject([{ id: 1 }]);
    });
    it('should use cached query', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any -- ignore that method is private */
      const spy = jest.spyOn(service as any, 'loadNodeFulltextQuery');

      await service.searchInNodeProperties('nothing');
      await service.searchInNodeProperties('nothing');

      expect(spy).toBeCalledTimes(1);
    });
  });
});
