
frontendDir="$PWD/../frontend"
frontendConfigPath="$frontendDir/.env"

printf "REACT_APP_QUERY_SERVICE_BACKEND_BASE_URI=http://localhost:8080
" > $frontendConfigPath

yarn --cwd $frontendDir install
yarn --cwd $frontendDir start
