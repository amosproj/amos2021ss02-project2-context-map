import { Neo4jConfig } from 'nest-neo4j/src/interfaces/neo4j-config.interface';
import neo4j, { Config as OriginalNeo4jConfig } from 'neo4j-driver';

/**
 * Adapted from @nest-neo4j's createDriver
 * @param config
 * @param neo4jConfig
 */
export const createNeo4jDriver = async (
  config: Neo4jConfig,
  neo4jConfig: OriginalNeo4jConfig,
) => {
  const driver = neo4j.driver(
    `${config.scheme}://${config.host}:${config.port}`,
    neo4j.auth.basic(config.username, config.password),
    neo4jConfig,
  );

  await driver.verifyConnectivity();

  return driver;
};
