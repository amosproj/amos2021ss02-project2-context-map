#!/usr/bin/env bash

# If the host points to localhost (or is not set), we need have to replace this
# with the address of the docker host
if [[ -z ${NEO4J_HOST} || ${NEO4J_HOST} == localhost || ${NEO4J_HOST} == 127.0.0.1 || ${NEO4J_HOST} == ::1 ]]; then
    echo "Rewrite neo4j host to docker host, as localhost was specified"
    export NEO4J_HOST=$(ip route show | awk '/default/ {print $3}');
fi

if [[ -z ${NEO4J_PORT} ]]; then
    echo "Using default neo4j port 7687"
    export NEO4J_PORT=7687;
fi

# TODO
export NEO4J_SCHEME=neo4j;

echo "Starting backend..."
node dist/src/main.js
