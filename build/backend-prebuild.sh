#!/usr/bin/env bash

# Please make sure that this file is executable if you are working in a windows environment
# This can be done by running "git update-index --chmod=+x .\backend-prebuild.sh" in the build directory

# Goto the backend dir
cd ../backend

# Copy shared files
cp -a ../shared/src/. ./src/shared/

# Execute linter
rimraf dist
yarn lint
