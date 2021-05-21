#!/usr/bin/env bash

# Deploy the backend to a docker container
cp -a ./shared/src/. ./backend/src/shared/
docker build -t kmap.backend ./backend