$scriptRoot = $PSScriptRoot
$frontendDir = $scriptRoot + "\..\frontend"

yarn --cwd $frontendDir install
yarn --cwd $frontendDir start