#!/bin/sh

mountDir="$PWD/../database/mount/"
databaseDump="testing-dump"
dbPassword="amos"
containerName="neo4j-db"

docker container stop $containerName
docker container rm $containerName

docker run \
    -p 7474:7474 -p 7687:7687 \
    -v $mountDir:/mnt/amos \
    --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
    --env DB_PASSWORD=$dbPassword \
    --env DB_PATH=/mnt/amos/dumps/$databaseDump.dump \
    --name $containerName  \
    neo4j:enterprise  \
    /mnt/amos/load-dump.sh