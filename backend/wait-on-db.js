/*
Fixed #301.
This script terminates after a successful connection to the neo4j database.
Connection details are taken from `__dirname/.env`, just like in the backend app.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const neo4j = require('neo4j-driver');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
  scheme: process.env.NEO4J_SCHEME,
  host: process.env.NEO4J_HOST,
  port: process.env.NEO4J_PORT,
  username: process.env.NEO4J_USERNAME,
  password: process.env.NEO4J_PASSWORD,
};

// eslint-disable-next-line no-console
console.log(config);

async function tryConnect() {
  let driver;
  let session;

  try {
    driver = neo4j.driver(
      `${config.scheme}://${config.host}:${config.port}`,
      neo4j.auth.basic(config.username, config.password)
    );
    await driver.verifyConnectivity();

    // start dummy query
    session = driver.session();
    await session.run('MATCH (n) RETURN n LIMIT 1');

    // eslint-disable-next-line no-console
    console.log('Connection successful');
  } catch (e) {
    const timeout = 5000;
    // eslint-disable-next-line no-console
    console.log(`Connection Error: Retrying in ${timeout}ms`);
    setTimeout(() => {
      tryConnect();
    }, timeout);
  } finally {
    if (session) await session.close();
    if (driver) await driver.close();
  }
}

tryConnect();
