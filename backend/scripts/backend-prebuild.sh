#!/usr/bin/env bash

# Please make sure that this file is executable if you are working in a windows environment
# This can be done by running "git update-index --chmod=+x .\backend-prebuild.sh" in the build directory

# Goto the backend dir
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# Only execute if not running inside a docker container
grep -sq 'docker\|lxc' /proc/1/cgroup
if [ $? -ne 0 ]; then

    # Copy shared files
    cp -a ../shared/src/. ./src/shared/

    # Execute linter
    rimraf dist
    yarn lint
fi
