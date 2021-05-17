$scriptRoot = $PSScriptRoot
$frontendDir = $scriptRoot + "\..\frontend"
$frontendConfigPath = $frontendDir + "\.env"

"REACT_APP_QUERY_SERVICE_BASE_URI=http://localhost:8080
" | Out-File -FilePath $frontendConfigPath -Encoding "UTF8"

yarn --cwd $frontendDir install
yarn --cwd $frontendDir start