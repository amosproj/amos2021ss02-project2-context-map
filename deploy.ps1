function CopyFilesToFolder ($fromFolder, $toFolder) {
    xcopy /S /I /Q /Y /F $fromFolder $toFolder
}

# Deploy the backend to a docker container
# First copy the shared files, as this is not done during the build process when running in docker
New-Item -ItemType Directory -Force -Path "./backend/src/shared" | Out-Null
xcopy /S /I /Q /Y /F ".\shared\src" ".\backend\src\shared" | Out-Null

# Now build the container as spec'ed by the backend dockerfile
docker build -t kmap.backend ./backend

# Deploy the frontend to a docker container that runs nginx
# First copy the shared files, as this is not done during the build process when running in docker
New-Item -ItemType Directory -Force -Path "./frontend/src/shared" | Out-Null
xcopy /S /I /Q /Y /F ".\shared\src" ".\frontend\src\shared" | Out-Null

# Remove the .env file, if it is present.
if (Test-Path .\frontend\.env) {
  Remove-Item .\frontend\.env
}

# Now build the container as spec'ed by the backend dockerfile
docker build -t kmap.frontend ./frontend

# Compose the output folder
if (Test-Path .\artifacts ) {
  Remove-Item -Recurse -Force .\artifacts 
}
New-Item -ItemType Directory -Force -Path .\artifacts | Out-Null
CopyFilesToFolder ".\deploy" ".\artifacts"
CopyFilesToFolder ".\database" ".\artifacts\database"
New-Item -ItemType Directory -Force -Path .\artifacts\images | Out-Null
docker save -o .\artifacts\images\kmap.backend kmap.backend
docker save -o .\artifacts\images\kmap.frontend kmap.frontend