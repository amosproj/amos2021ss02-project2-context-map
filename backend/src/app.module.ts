import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { Neo4jModule } from 'nest-neo4j/dist';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // TODO add validation schema (https://egghead.io/lessons/node-js-configure-a-nestjs-api-with-environment-variables-using-configmodule-and-joi)
      // validationSchema: []
    }),
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: process.env.NEO4J_HOST,
      port: process.env.NEO4J_PORT,
      username: process.env.NEO4J_USERNAME,
      password: process.env.NEO4J_PASSWORD,
      database: process.env.NEO4J_DATABASE,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
