# Goto the backend dir
cd ../backend

# Copy shared files
New-Item -ItemType Directory -Force -Path ".\src\shared"
xcopy /S /I /Q /Y /F "..\shared\src" ".\src\shared"

# Execute linter
rimraf dist
yarn lint
