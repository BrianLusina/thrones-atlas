#!/usr/bin/env bash

ENV_FILE=.env

if [ ! -f ${ENV_FILE} ]; then
    echo ">>> Setting up env file"
    touch ${ENV_FILE}
    echo ${DATABASE_URL} >> ${ENV_FILE}
    echo ${REDIS_HOST} >> ${ENV_FILE}
    echo ${REDIS_PORT} >> ${ENV_FILE}
fi