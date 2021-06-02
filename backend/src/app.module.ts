import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { KmapNeo4jModule } from './config/neo4j/KmapNeo4jModule';
import { FilterController } from './filter/filter.controller';
import { FilterService } from './filter/filter.service';
import { SchemaController } from './schema/schema.controller';
import { SchemaService } from './schema/schema.service';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { SearchIndexBuilder } from './search/SearchIndexBuilder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // TODO add validation schema (https://egghead.io/lessons/node-js-configure-a-nestjs-api-with-environment-variables-using-configmodule-and-joi)
      // validationSchema: []
    }),
    KmapNeo4jModule.fromEnv({
      disableLosslessIntegers: true,
    }),
  ],
  controllers: [
    AppController,
    SchemaController,
    SearchController,
    FilterController,
  ],
  providers: [
    AppService,
    SchemaService,
    SearchService,
    FilterService,
    SearchIndexBuilder,
  ],
})
export class AppModule {}
