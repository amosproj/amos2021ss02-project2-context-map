#!/usr/bin/env bash

mkdir /etc/nginx/logs
touch /etc/nginx/logs/error.log

echo "Starting nginx..."
nginx -g 'daemon off;';