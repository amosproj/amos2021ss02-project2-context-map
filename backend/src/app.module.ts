import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { KmapNeo4jModule } from './config/neo4j/KmapNeo4jModule';
import { GraphInfoController } from './graph-info/graph-info.controller';
import { GraphInfoService } from './graph-info/graph-info.service';

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
  controllers: [AppController, GraphInfoController],
  providers: [AppService, GraphInfoService],
})
export class AppModule {}
