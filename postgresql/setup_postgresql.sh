#!/usr/bin/env bash

# This creates a docker file for the postgres configuration
export POSTGRES_USER=nightking
export POSTGRES_PASSWORD=atlas
export POSTGRES_DB=atlasofthrones
export DOCKER_FILE=Dockerfile

function createPostgreSQLDockerFile {
    echo ">>> Downloading database dump"
    wget https://cdn.patricktriest.com/atlas-of-thrones/atlas_of_thrones.sql

    # Before creating files, check that the destination directory exists
    if [ ! -f ${DOCKER_FILE} ]; then
        echo "Creating PostgreSQL Dockerfile..."
        touch ${DOCKER_FILE}
    fi

    echo "FROM postgres:latest" >> ${DOCKER_FILE}
    echo "" >> ${DOCKER_FILE}
    echo "# Set environment variables for postgres" >> ${DOCKER_FILE}
    echo "ENV POSTGRES_USER ${POSTGRES_USER}" >> ${DOCKER_FILE}
    echo "ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}" >> ${DOCKER_FILE}
    echo "ENV POSTGRES_DB ${POSTGRES_DB}" >> ${DOCKER_FILE}
    echo "RUN CREATE USER ${POSTGRES_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';" >> ${DOCKER_FILE}
    echo "RUN CREATE DATABASE ${POSTGRES_DB};" >> ${DOCKER_FILE}
    echo "RUN GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} to ${POSTGRES_USER};" >> ${DOCKER_FILE}
    echo "RUN GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${POSTGRES_USER};" >> ${DOCKER_FILE}
    echo "RUN \c ${POSTGRES_DB}" >> ${DOCKER_FILE}
    echo "RUN CREATE EXTENSION postgis;" >> ${DOCKER_FILE}
    echo "RUN psql -d ${POSTGRES_DB} < atlas_of_thrones.sql" >> ${DOCKER_FILE}

}

createPostgreSQLDockerFile