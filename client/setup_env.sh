#!/usr/bin/env bash

ENV_FILE=.env

if [ ! -f ${ENV_FILE} ]; then
    echo ">>> Setting up env file"
    touch ${ENV_FILE}
    echo ${API_URL} >> ${ENV_FILE}
    echo ${ICON_URL} >> ${ENV_FILE}
fi