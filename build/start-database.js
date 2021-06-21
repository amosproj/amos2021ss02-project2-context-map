/*
Starts the database docker container with the testing dump.
 */

const path = require("path");
const { execSync } = require("child_process");
const { parseArgs } = require("./parse-args");

const containerName="neo4j-db"
const repoPath = path.join(__dirname, "..");
const mountPath = path.join(repoPath, "database", "mount");
const pluginsPath = path.join(repoPath, "database", "plugins");

const flags = [
  {
    name: 'detached',
    abbr: 'd'
  }
];

const args = [
  { name: 'mount-path' },
  { name: 'plugin-path' },
  { name: 'db-password' },
  { name: 'container-name' },
];

function buildCommand(args) {
  return `
    docker run ${args.detached ? '-d' : ''} -p 7474:7474 -p 7687:7687 \\
      -v ${args.mountPath}:/mnt/amos \\
      -v ${args.pluginsPath}:/plugins \\
      --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \\
      --env DB_PASSWORD=${args.dbPassword} \\
      --env DB_PATH=/mnt/amos/dumps/testing-dump.dump \\
      --env 'NEO4JLABS_PLUGINS=["apoc", "graph-data-science"]' \\
      --env 'NEO4J_dbms_security_procedures_unrestricted=apoc.*,gds.*' \\
      --env 'NEO4J_dbms_security_procedures_allowlist=apoc.*,gds.*' \\
      --env NEO4J_apoc_import_file_enabled=true \\
      --name ${args.containerName} neo4j:4.2-enterprise \\
      /mnt/amos/load-dump.sh
`
}

function postProcessArgs(args) {
  const result = { ...args };

  if (result.mountPath === undefined) {
    result.mountPath = mountPath;
  }

  if (result.pluginsPath === undefined) {
    result.pluginsPath = pluginsPath;
  }

  if (result.dbPassword === undefined) {
    result.dbPassword = 'amos';
  }

  if (result.containerName === undefined) {
    result.containerName = containerName;
  }

  return result;
}

async function main() {
  const input = process.argv.slice(2);
  const parsedArgs = parseArgs(input, flags, args);
  const postProcessedArgs = postProcessArgs(parsedArgs);

  try {
    execSync(`docker container stop ${postProcessedArgs.containerName}`, {stdio: 'inherit'})
  } catch(e) {}

  try {
    execSync(`docker container rm ${postProcessedArgs.containerName}`, {stdio: 'inherit'})
  } catch(e) {}

  const command = buildCommand(postProcessedArgs);
  execSync(command, {stdio: 'inherit'});
}

main();
