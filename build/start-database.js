/*
Starts the database docker container with the testing dump.
 */

const path = require("path");
const { execSync } = require("child_process");

const containerName="neo4j-db"
const repoPath = path.join(__dirname, "..");
const mountPath = path.join(repoPath, "database", "mount");
const pluginsPath = path.join(repoPath, "database", "plugins");

async function main() {
  try {
    execSync(`docker container stop ${containerName}`)
  } catch(e) {}

  try {
    execSync(`docker container rm ${containerName}`)
  } catch(e) {}

  const command = `
    docker run -d -p 7474:7474 -p 7687:7687 \\
      -v ${mountPath}:/mnt/amos \\
      -v ${pluginsPath}:/plugins \\
      --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \\
      --env DB_PASSWORD=amos \\
      --env DB_PATH=/mnt/amos/dumps/testing-dump.dump \\
      --env 'NEO4JLABS_PLUGINS=["apoc", "graph-data-science"]' \\
      --env 'NEO4J_dbms_security_procedures_unrestricted=apoc.*,gds.*' \\
      --env 'NEO4J_dbms_security_procedures_allowlist=apoc.*,gds.*' \\
      --env NEO4J_apoc_import_file_enabled=true \\
      --name ${containerName} neo4j:4.2-enterprise \\
      /mnt/amos/load-dump.sh
`

  execSync(command);
}

main();
