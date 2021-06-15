#!/usr/bin/env bash

ARTIFACTS_DIR=./artifacts

KEY_FILE=./amos-fau-proj2@group.riehle.org
HOST_PUB_KEY_FILE=./Server_Keyscan.txt

HOST=5.183.20.2
USER=root

SSH_DIR=~/.ssh/
SSH_KEY_DIR="$SSH_DIR"keys/
SSH_KEY_PATH="$SSH_KEY_DIR"$HOST.key
SSH_KNOWN_HOSTS_PATH="$SSH_DIR"known_hosts

mkdir -p $SSH_KEY_DIR
cat $KEY_FILE > $SSH_KEY_PATH
sudo chmod 600 $SSH_KEY_PATH
touch $SSH_KNOWN_HOSTS_PATH
cat $HOST_PUB_KEY_FILE >> $SSH_KNOWN_HOSTS_PATH
ssh -i $SSH_KEY_PATH $USER@$HOST 'docker compose down && rm -rf ~/amos'
scp -i $SSH_KEY_PATH -r $ARTIFACTS_DIR $USER@$HOST:~/amos/
ssh -i $SSH_KEY_PATH $USER@$HOST 'cd ~/amos/ && ./kmap.sh'
# read x