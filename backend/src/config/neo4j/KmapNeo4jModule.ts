import { DynamicModule, FactoryProvider } from '@nestjs/common';
import { Neo4jConfig, Neo4jModule } from 'nest-neo4j/dist';
import { NEO4J_DRIVER } from 'nest-neo4j/dist/neo4j.constants';
import { Config as Neo4jDriverOptions } from 'neo4j-driver';
import { createNeo4jDriver } from './createNeo4jDriver';

/**
 * Drop in replacement for {@link Neo4jModule} to enable
 * additional neo4j driver options.
 */
export class KmapNeo4jModule {
  /**
   * Overrides the driver factory from the {@link Neo4jModule} so additional
   * additional {@link Neo4jDriverOptions} are possible.
   * @private
   */
  private static replaceDriverWithCustomDriver(
    module: DynamicModule,
    options: Neo4jDriverOptions
  ): DynamicModule {
    const driverProvider = module.providers?.find(
      // eslint-disable-next-line dot-notation
      (provider) =>
        typeof provider === 'object' && provider.provide === NEO4J_DRIVER
    ) as FactoryProvider;

    if (driverProvider == null) {
      /* istanbul ignore next */
      throw Error('Neo4j driver provider not found.');
    }

    driverProvider.useFactory = async (config: Neo4jConfig) =>
      createNeo4jDriver(config, options);

    return module;
  }

  /**
   * Creates a Neo4jModule.
   * Uses environment variables to retrieve connection details.
   * Uses {@link Neo4jModule.fromEnv}.
   */
  static fromEnv(options: Neo4jDriverOptions): DynamicModule {
    return this.replaceDriverWithCustomDriver(Neo4jModule.fromEnv(), options);
  }
}
