# Database

The Database is expected to run in a docker container. This folder provides a structure to quickly run such a container
that loads a previously generated database dump.

There is no new docker image created. The container runs a standard [neo4j-image](https://hub.docker.com/_/neo4j/) with
a special configuration to load dump files.

## Folder structure

```
docker
└─ mount // This folder is be mounted on the container
    ├─ dumps // This folder can contain dump files that can be loaded
    │   └─ example.dump  
    └─ load-dump.sh // This script is the entrypoint in the container  
```

## Running the container

The following parameters should be set:

- Environment Variables

  | Variable                       | Value / \<Type> | Required            | Comment                                  |
      |--------------------------------|-----------------|---------------------|------------------------------------------|
  | NEO4J_ACCEPT_LICENSE_AGREEMENT | yes             | yes                 |                                          |
  | DB_PASSWORD                    | \<string>       | yes                 | Change it!                               |
  | DB_URL                         | \<string>       | iff DB_PATH is empty | This dump-file is downloaded and loaded. |
  | DB_PATH                        | \<string>       | iff DB_URL is empty  | This dump-file is loaded.                |

- Mounts
  - path/to/backend/docker/mount -> /mnt/amos
- Image: `neo4j-enterprise`
- Command: `/mnt/amos/load-dump.sh`

### Example 1 - Command Line:
```
docker run 
    -p 7474:7474 -p 7687:7687 
    -v path/to/backend/docker/mount:/mnt/amos
    --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes
    --env DB_PASSWORD=amos // CHANGE IT
    --env DB_PATH=/mnt/amos/dumps/example.dump
    --name neo4j-DB 
    neo4j:enterprise 
    /mnt/docker/load-dump.sh
```

### Example 2 - IntelliJ Run Configuration
There is an IntelliJ Run Configuration called "Database" with the basic settings.
You can use that *as a template*, so make sure to copy it to apply your individual changes.
Currently, there is a problem with relative paths, so e.g. the mount path must be provided as an absolute path.

## Datasets

Example datasets can be found in the `mount/dumps` directory.
Currently, there are none created by us and thus the directory is empty.
Public dumps are listed in the [neo4j-graph-examples](https://github.com/neo4j-graph-examples) repository.
