import { Neo4jConfig } from 'nest-neo4j/src/interfaces/neo4j-config.interface';
import {
  Config as OriginalNeo4jConfig,
  driver as neo4jDriver,
  auth,
  Driver,
} from 'neo4j-driver';

/**
 * Adapted from @nest-neo4j's createDriver
 * @param config
 * @param neo4jConfig
 */
export const createNeo4jDriver = async (
  config: Neo4jConfig,
  neo4jConfig: OriginalNeo4jConfig,
): Promise<Driver> => {
  const driver = neo4jDriver(
    `${config.scheme}://${config.host}:${config.port}`,
    auth.basic(config.username, config.password),
    neo4jConfig,
  );

  await driver.verifyConnectivity();

  return driver;
};
