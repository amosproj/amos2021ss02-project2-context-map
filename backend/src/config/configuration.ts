/**
 * Configuration options.
 * Maps environment variables to object.
 */
export const configuration = () => ({
  'neo4j.scheme': process.env.NEO4J_SCHEME,
  'neo4j.host': process.env.NEO4J_HOST,
  'neo4j.port': process.env.NEO4J_PORT,
  'neo4j.username': process.env.NEO4J_USERNAME,
  'neo4j.password': process.env.NEO4J_PASSWORD,
  'neo4j.database': process.env.NEO4J_DATABASE,
  'cors.url': process.env.CORS_URL,
});
