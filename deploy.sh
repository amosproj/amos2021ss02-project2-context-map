CopyFilesToFolder () {
  fromFolder=$1
  toFolder=$2
  cp -a $fromFolder $toFolder
}

# Deploy the backend to a docker container
# First copy the shared files, as this is not done during the build process when running in docker
cp -a ./shared/src/. ./backend/src/shared/

# Now build the container as spec'ed by the backend dockerfile
docker build -t kmap.backend ./backend

# Deploy the frontend to a docker container that runs nginx
# First copy the shared files, as this is not done during the build process when running in docker
cp -a ./shared/src/. ./frontend/src/shared/

# Remove the .env file, if it is present.
if test -f ./frontend/.env; then
  rm ./frontend/.env
fi

# Now build the container as spec'ed by the backend dockerfile
docker build -t kmap.frontend ./frontend

# Compose the output folder
if test -d ./artifacts/; then
  rm -rf ./artifacts/
fi

CopyFilesToFolder ./deploy/ ./artifacts/
CopyFilesToFolder ./database/ ./artifacts/database/

mkdir ./artifacts/images
docker save -o ./artifacts/images/kmap.backend kmap.backend
docker save -o ./artifacts/images/kmap.frontend kmap.frontend
