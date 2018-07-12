#!/usr/bin/env bash

export DATABASE_DUMP_FILE=atlas_of_thrones.sql

if [ ! -f ${DATABASE_DUMP_FILE} ]; then
    echo ">>> Downloading database dump"
    wget ${DATABASE_DUMP_URI}
fi
