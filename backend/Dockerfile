# syntax=docker/dockerfile:1
# This implements a multi-stage container build process

# First build the project
FROM node:14-alpine AS dev
RUN apk update && apk add --no-cache python g++ make bash

# Set environment variables
ENV DOCKER=DOCKER

# Set our working directory
WORKDIR /usr/src/kmap/backend

# Install our dependencies
COPY package*.json ./
COPY yarn.lock* ./
COPY scripts scripts/
RUN chmod +x scripts/backend-prebuild.sh
RUN yarn install

# Build the project
COPY . .
RUN yarn run build

# Now build the container that is used in production
FROM node:14.17-alpine as prod

# Install bash
RUN apk update && apk add --no-cache bash

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV DOCKER=DOCKER

# Set our working directory
WORKDIR /usr/src/kmap/backend

# Install our dependencies (production only)
COPY package*.json ./
COPY yarn.lock* ./
COPY scripts scripts/
RUN chmod +x scripts/backend-prebuild.sh
RUN yarn install --production

# Copy the dist folder from the dev container
COPY --from=dev /usr/src/kmap/backend/dist dist

# Copy the docker specific scripts and files
COPY docker docker

# Start
RUN chmod +x docker/run.sh
CMD ["docker/run.sh"]
