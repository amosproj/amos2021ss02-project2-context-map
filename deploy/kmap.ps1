docker-compose down

docker load -i .\images\kmap.frontend
docker load -i .\images\kmap.backend

docker-compose up -d