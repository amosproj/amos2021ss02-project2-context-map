#!/bin/bash

# The dump-file here will be loaded
dump_path=""

# If DB_PATH given, use it
if [[ -n "${DB_PATH}" ]]; then
  echo "Found a path to a dump."
  if [[ ! -f "${DB_PATH}" ]]; then
    echo "${DB_PATH} does not point to a file. Stopping..."
    exit 1
  fi
  dump_path="${DB_PATH}"

# If DB_URL given, use it
elif [[ -n "${DB_URL}" ]]; then
  echo "Found a URL to an dump. Downloading ${DB_URL}."
  # TODO Handle download error
  wget "${DB_URL}" -O downloaded.dump
  dump_path="downloaded.dump"

fi

# Load file
if [[ -n $dump_path ]]; then
  neo4j-admin load --from="${dump_path}" --database=neo4j --force
  echo "Loaded dump."
else
  echo "No dump found. Starting with a clean DB."
fi

# Change Password
neo4j-admin set-initial-password "${DB_PASSWORD}"

# Start DB
neo4j console
