#!/usr/bin/env bash

# This creates a docker file for the postgres configuration
export POSTGRES_VERSION=9.6
export POSTGRES_USER=nightking
export POSTGRES_PASSWORD=atlas
export POSTGRES_DB=atlasofthrones
export POSTGRES_KEY=B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8
export DOCKER_FILE=Dockerfile
export DATABASE_DUMP_FILE=atlas_of_thrones.sql
export DATABASE_DUMP_URL=https://cdn.patricktriest.com/atlas-of-thrones
export IMAGE=ubuntu
export IMAGE_VERSION=xenial

if [ ! -f ${DATABASE_DUMP_FILE} ]; then
    echo ">>> Downloading database dump"
    wget ${DATABASE_DUMP_URL}/${DATABASE_DUMP_FILE}
fi

# Before creating files, check that the destination directory exists
if [ ! -f ${DOCKER_FILE} ]; then
    echo "Creating PostgreSQL Dockerfile..."
    touch ${DOCKER_FILE}
fi


function createPostgreSQLDockerFile {
    echo "FROM ${IMAGE}:${IMAGE_VERSION}" >> ${DOCKER_FILE}
    echo "" >> ${DOCKER_FILE}

    echo "MAINTAINER Brian Lusina \"lusinabrian@gmail.com\"" >> ${DOCKER_FILE}
    echo "" >> ${DOCKER_FILE}

    echo "RUN apt-get update; apt-get install -y curl" >> ${DOCKER_FILE}

    echo "RUN curl -L -o ${DATABASE_DUMP_FILE} ${DATABASE_DUMP_URL}/${DATABASE_DUMP_FILE}" >> ${DOCKER_FILE}
    echo "" >> ${DOCKER_FILE}

    # echo "# Set environment variables for postgres" >> ${DOCKER_FILE}
    echo "ENV POSTGRES_USER ${POSTGRES_USER}" >> ${DOCKER_FILE}
    echo "ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}" >> ${DOCKER_FILE}
    echo "ENV POSTGRES_DB ${POSTGRES_DB}" >> ${DOCKER_FILE}

    echo "" >> ${DOCKER_FILE}
    # Add the PostgreSQL PGP key to verify their Debian packages.
    # It should be the same key as https://www.postgresql.org/media/keys/ACCC4CF8.asc
    echo "RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys ${POSTGRES_KEY}" >> ${DOCKER_FILE}
    echo "" >> ${DOCKER_FILE}

    # Add PostgreSQL's repository. It contains the most recent stable release
    echo "RUN echo \"deb http://apt.postgresql.org/pub/repos/apt/ ${IMAGE_VERSION}-pgdg main\" > /etc/apt/sources.list.d/pgdg.list" >> ${DOCKER_FILE}
    echo "" >> ${DOCKER_FILE}

    # Install ``python-software-properties``, ``software-properties-common`` and PostgreSQL 9.3
    #  There are some warnings (in red) that show up during the build. You can hide
    #  them by prefixing each apt-get statement with DEBIAN_FRONTEND=noninteractive
    echo "RUN apt-get update && apt-get install -y python-software-properties software-properties-common postgresql-${POSTGRES_VERSION} postgresql-client-${POSTGRES_VERSION} postgresql-contrib-${POSTGRES_VERSION} postgresql-${POSTGRES_VERSION}-postgis-scripts postgresql-${POSTGRES_VERSION}-postgis-2.3" >> ${DOCKER_FILE}

    echo "" >> ${DOCKER_FILE}
    # Note: The official Debian and Ubuntu images automatically ``apt-get clean``
    # after each ``apt-get``

    # Run the rest of the commands as the ``postgres`` user created by the ``postgres-9.6``
    # package when it was ``apt-get installed``
    # echo "USER ${POSTGRES_USER}" >> ${DOCKER_FILE}
    echo "USER postgres" >> ${DOCKER_FILE}

    # Create a PostgreSQL role named ``${POSTGRES_USER}`` with ``${POSTGRES_PASSWORD}`` as the
    # password and
    # then create a database `${POSTGRES_DB}` owned by the ``${POSTGRES_USER}`` role.
    # Note: here we use ``&&\`` to run commands one after the other - the ``\``
    #       allows the RUN command to span multiple lines.
    echo "RUN /etc/init.d/postgresql start && psql --command \"CREATE USER ${POSTGRES_USER} WITH SUPERUSER PASSWORD '${POSTGRES_PASSWORD}';\" && createdb ${POSTGRES_DB} &&\
    psql --command \"GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} to ${POSTGRES_USER};\" &&\
    psql --command \"GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${POSTGRES_USER};\" &&\
    psql --command \"\c ${POSTGRES_DB}\" &&\
    psql --command \"CREATE EXTENSION postgis;\" &&\
    psql --command \"--dbname ${POSTGRES_DB} < ${DATABASE_DUMP_FILE}\" &&\
    psql --command \"\q\" " >> ${DOCKER_FILE}

    echo "" >> ${DOCKER_FILE}

    # Adjust PostgreSQL configuration so that remote connections to the
    # database are possible.
    echo "RUN echo \"host all  all  0.0.0.0/0  md5\" >> /etc/postgresql/${POSTGRES_VERSION}/main/pg_hba.conf" >> ${DOCKER_FILE}

    # And add ``listen_addresses`` to ``/etc/postgresql/9.3/main/postgresql.conf``
    echo "RUN echo \"listen_addresses='*'\" >> /etc/postgresql/${POSTGRES_VERSION}/main/postgresql.conf" >> ${DOCKER_FILE}

    # Expose the PostgreSQL port
    echo "EXPOSE 5432" >> ${DOCKER_FILE}

    echo "" >> ${DOCKER_FILE}

    # Add VOLUMEs to allow backup of config, logs and databases
    echo "VOLUME [\"/etc/postgresql\", \"/var/log/postgresql\", \"/var/lib/postgresql\"]" >> ${DOCKER_FILE}

    echo "" >> ${DOCKER_FILE}
    # Set the default command to run when starting the container
    echo "CMD [\"/usr/lib/postgresql/${POSTGRES_VERSION}/bin/postgres\", \"-D\", \"/var/lib/postgresql/${POSTGRES_VERSION}/main\", \"-c\", \"config_file=/etc/postgresql/${POSTGRES_VERSION}/main/postgresql.conf\"]" >> ${DOCKER_FILE}
}

createPostgreSQLDockerFile