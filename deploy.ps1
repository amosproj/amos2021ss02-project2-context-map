# Deploy the backend to a docker container
# First copy the shared files, as this is not done, during the build process when running in docker
New-Item -ItemType Directory -Force -Path "./backend/src/shared" | Out-Null
xcopy /S /I /Q /Y /F ".\shared\src" ".\backend\src\shared" | Out-Null

# Now build the container as spec'ed by the backend dockerfile
docker build -t kmap.backend ./backend