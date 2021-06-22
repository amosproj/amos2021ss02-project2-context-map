import { Neo4jConfig } from 'nest-neo4j/src/interfaces/neo4j-config.interface';
import {
  auth,
  Config as OriginalNeo4jConfig,
  driver as neo4jDriver,
  Driver,
} from 'neo4j-driver';

function delay(timeout: number): Promise<void> {
  if (timeout <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

async function tryConnect(driver: Driver): Promise<boolean> {
  let session;
  try {
    await driver.verifyConnectivity();
    session = driver.session();
    await session.run('MATCH (n) RETURN n LIMIT 1');
    return true;
  } catch (e) {
    return false;
  } finally {
    await session?.close();
  }
}

async function createDriverWithRetry(
  config: Neo4jConfig,
  neo4jConfig: OriginalNeo4jConfig
): Promise<Driver> {
  const driver = neo4jDriver(
    `${config.scheme}://${config.host}:${config.port}`,
    auth.basic(config.username, config.password),
    neo4jConfig
  );

  // eslint-disable-next-line no-await-in-loop
  while (!(await tryConnect(driver))) {
    const timeout = 5000;
    // eslint-disable-next-line no-console
    console.log(`Connection Error: Retrying in ${timeout}ms`);
    // eslint-disable-next-line no-await-in-loop
    await delay(timeout);
  }

  return driver;
}

/**
 * Adapted from @nest-neo4j's createDriver
 * @param config
 * @param neo4jConfig
 */
export const createNeo4jDriver = createDriverWithRetry;
