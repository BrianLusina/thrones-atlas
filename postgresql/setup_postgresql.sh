#!/usr/bin/env bash

# This creates a docker file for the postgres configuration
export POSTGRES_USER=nightking
export POSTGRES_PASSWORD=atlas
export POSTGRES_DB=atlasofthrones
DOCKER_FILE=Dockerfile

# Before creating files, check that the destination directory exists
if [ ! -f ${DOCKER_FILE} ]; then
    echo "Creating PostgreSQL Dockerfile..."
    touch ${DOCKER_FILE}
fi

function createPostgreSQLDockerFile{

    echo "FROM postgres:latest">> ${DOCKER_FILE}
    echo "\n">> ${DOCKER_FILE}
    echo "# Set environment variables for postgres">> ${DOCKER_FILE}
    echo "ENV POSTGRES_USER ${POSTGRES_USER}" >> ${DOCKER_FILE}
    echo "ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}" >> ${DOCKER_FILE}
    echo "ENV POSTGRES_DB ${POSTGRES_DB}" >> ${DOCKER_FILE}
}

createPostgreSQLDockerFile