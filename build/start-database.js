const path = require("path");
const { execSync } = require("child_process");
const { parseArgs } = require("./parse-args");

const containerName="neo4j-db"
const repoPath = path.join(__dirname, "..");
const mountPath = path.join(repoPath, "backend", "docker", "mount");
const pluginsPath = path.join(repoPath, "backend", "docker", "plugins");

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
  { name: 'dump' },
];

function buildCommand(args) {
  let command = `docker run ${args.detached ? '-d' : ''} -p 7474:7474 -p 7687:7687`;
  command += ` -v ${args.mountPath}:/mnt/amos`;
  command += ` -v ${args.pluginsPath}:/plugins`;
  command += ` --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes`;
  command += ` --env DB_PASSWORD=${args.dbPassword}`;
  command += ` --env DB_PATH=/mnt/amos/dumps/${args.dump}.dump`;
  command += ` --env 'NEO4JLABS_PLUGINS=["apoc", "graph-data-science"]'`;
  command += ` --env 'NEO4J_dbms_security_procedures_unrestricted=apoc.*,gds.*'`;
  command += ` --env 'NEO4J_dbms_security_procedures_allowlist=apoc.*,gds.*'`;
  command += ` --env NEO4J_apoc_import_file_enabled=true`;
  command += ` --name ${args.containerName} neo4j:4.2-enterprise`;
  command += ` /mnt/amos/load-dump.sh`;

  return command;
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

  if (result.dump === undefined) {
    result.dump = 'testing-dump';
  }

  return result;
}

function execCMDAndCatchErrors(cmd) {
  const isWin = process.platform === "win32";
  let execOptions = { stdio: 'inherit' };

  if (isWin) {
    execOptions.shell = 'powershell.exe';
  }

  try {
    execSync(cmd, execOptions)
  } catch(e) {
    console.log("Error executing command.");
    console.log(e);
  }
}

/*
 * Starts the database docker container with the testing dump.
 */
async function main() {
  const input = process.argv.slice(2);
  const parsedArgs = parseArgs(input, flags, args);
  const postProcessedArgs = postProcessArgs(parsedArgs);

  execCMDAndCatchErrors(`docker container stop ${postProcessedArgs.containerName}`);
  execCMDAndCatchErrors(`docker container rm ${postProcessedArgs.containerName}`);

  const command = buildCommand(postProcessedArgs);
  execCMDAndCatchErrors(command);
}

main();
