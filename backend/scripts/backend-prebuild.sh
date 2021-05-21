#!/usr/bin/env bash

# Please make sure that this file is executable if you are working in a windows environment
# This can be done by running "git update-index --chmod=+x .\backend-prebuild.sh" in the build directory

# Goto the backend dir
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

if ![ -f /.dockerenv ]
then

    # Copy shared files
    cp -a ../shared/src/. ./src/shared/

    # Execute linter
    rimraf dist
    yarn lint
fi
