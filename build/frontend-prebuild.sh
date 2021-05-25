#!/usr/bin/env bash

# Please make sure that this file is executable if you are working in a windows environment
# This can be done by running "git update-index --chmod=+x .\frontend-prebuild.sh" in the build directory

# Goto the frontend dir
cd ../frontend

# Copy shared files
cp -a ../shared/src/. ./src/shared/

# Execute linter
yarn lint
