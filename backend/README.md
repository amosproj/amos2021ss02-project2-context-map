# Description

This app is the backend of the AMOS KMAP.

## Installation

```bash
$ yarn install
```

## Running the app

### Environment Variables.
Be sure to create a `.env` file in this directory.
Important but private information like the database connection settings can be stored here.
An example can be found in the `.env.example` file.

If you want to access the backend from another server, you have to enable CORS. You can provide the URL of your server via the environment variable `CORS_URL`.

### Neo4j-Database (with Docker)

The app requires a connection to a neo4j server.
The easiest way to start one is by running a docker container as described in the [KMAP Docker Readme](docker/README.md).

### Run commands

```bash
# development
$ yarn run start

# watch mode (auto updates when files change)
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Testing

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```
