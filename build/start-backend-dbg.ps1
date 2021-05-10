$scriptRoot = $PSScriptRoot
$backendDir = $scriptRoot + "\..\backend"
$backendConfigPath = $backendDir + "\.env"

$dbUsername = "neo4j"
$dbPassword = "amos"

"NEO4J_SCHEME=neo4j
NEO4J_HOST=localhost
NEO4J_PORT=7687
NEO4J_USERNAME=$dbUsername
NEO4J_PASSWORD=$dbPassword
NEO4J_DATABASE=neo4j

CORS_URL=http://localhost:3000" | Out-File -FilePath $backendConfigPath -Encoding "UTF8"

yarn --cwd $backendDir install
yarn --cwd $backendDir start