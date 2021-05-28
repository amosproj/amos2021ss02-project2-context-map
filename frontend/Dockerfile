# syntax=docker/dockerfile:1
# This implements a multi-stage container build process

# First build the project
FROM node:14-alpine AS dev
RUN apk update && apk add --no-cache python g++ make bash

# Set environment variables
ENV DOCKER=DOCKER

# Set our working directory
WORKDIR /usr/src/kmap/frontend

# Install our dependencies
COPY package*.json ./
COPY yarn.lock* ./
COPY scripts scripts/
RUN chmod +x scripts/frontend-prebuild.sh
RUN yarn install

# Build the project
COPY . .
RUN yarn run build

# Now build the container that is used in production
FROM nginx:1.20.1-alpine as prod

# Install bash
RUN apk update && apk add --no-cache bash

# Set our working directory
WORKDIR /usr/src/kmap/frontend

# Copy the build folder from the dev container
COPY --from=dev /usr/src/kmap/frontend/build dist

# Copy the docker specific scripts and files
COPY docker docker

# Copy the nginx configuration
RUN mv docker/nginx.conf /etc/nginx/nginx.conf

# Start
RUN chmod +x docker/run.sh
CMD ["docker/run.sh"]