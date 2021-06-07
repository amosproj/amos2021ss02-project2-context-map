$scriptRoot = $PSScriptRoot
$mountDir = $scriptRoot + "\..\backend\docker\mount"
$pluginsDir = $scriptRoot + "\..\backend\docker\plugins"
$databaseDump = "testing-dump"
$dbPassword = "amos"
$containerName = "neo4j-db"

docker container stop $containerName
docker container rm $containerName
docker run `
    -p 7474:7474 `
    -p 7687:7687 `
    -v $mountDir`:/mnt/amos `
    -v $pluginsDir`:/plugins `
    --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes `
    --env DB_PASSWORD=$dbPassword `
    --env DB_PATH=/mnt/amos/dumps/$databaseDump.dump `
    --env 'NEO4JLABS_PLUGINS=["apoc", "gds"]' `
    --env 'NEO4J_dbms_security_procedures_unrestricted=apoc.*,gds.*' `
    --env 'NEO4J_dbms_security_procedures_allowlist=apoc.*,gds.*' `
    --env NEO4J_apoc_import_file_enabled=true `
    --env NEO4J_dbms_shell_enabled=true `
    --name $containerName `
    neo4j:enterprise /mnt/amos/load-dump.sh
