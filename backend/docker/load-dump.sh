# Uncomment this if you want to load a dump from an URL
# wget https://github.com/neo4j-graph-examples/network-management/raw/main/data/network-management-40.dump -O test.dump
# neo4j-admin load --from=test.dump --database=neo4j --force

# Uncomment this if you want to load a dump from the local filesystem
neo4j-admin load --from=/mnt/dumps/myDump.dump --database=neo4j --force

# Change Password
neo4j-admin set-initial-password $DB_PASSWORD

neo4j console

