#!/usr/bin/env bash

# Please make sure that this file is executable if you are working in a windows environment
# This can be done by running "git update-index --chmod=+x .\frontend-prebuild.sh" in the build directory

# Goto the frontend dir
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"/..

# Only execute if not running inside a docker container
if [ "$DOCKER" != "DOCKER" ]; then

    # Copy shared files
    cp -a ../shared/src/. ./src/shared/

    # Execute linter
    yarn lint

fi
