# Goto the frontend dir
cd ../frontend

# Copy shared files
New-Item -ItemType Directory -Force -Path ".\src\shared"
xcopy /S /I /Q /Y /F "..\shared\src" ".\src\shared"

# Execute linter
yarn lint
