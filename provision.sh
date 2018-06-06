#!/usr/bin/env bash

# echo colors
CYAN='\033[0;36m'

echo -e "${CYAN} ===> Setting Timezone & Locale to $3 & en_US.UTF-8"

sudo ln -sf /usr/share/zoneinfo/$3 /etc/localtime
sudo apt-get install -qq language-pack-en
sudo locale-gen en_US
sudo update-locale LANG=en_US.UTF-8 LC_CTYPE=en_US.UTF-8

echo -e "${CYAN} ===> Repair tty log message"
sudo sed -i "/tty/!s/mesg n/tty -s \\&\\& mesg n/" /root/.profile

# in order to avoid the message
# ===> default: dpkg-preconfigure: unable to re-open stdin: No such file or directory
# use "> /dev/null 2>&1 inorder to redirect stdout to /dev/null"
# for more info see http://stackoverflow.com/questions/10508843/what-is-dev-null-21

echo -e "${CYAN} ===>  Installing Node and NPM"
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm

echo -e "${CYAN} ====> Installing yarn"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
echo export PATH="$PATH:`yarn global bin`" >> ~/.bashrc

echo -e "${CYAN}===> Installing and setting up Docker"
# allows docker to use the aufs storage drives
sudo apt-get install -y --no-install-recommends linux-image-extra-$(uname -r) linux-image-extra-virtual

# Install packages to allow apt to use a repository over HTTPS:
echo -e "${CYAN}===> Install pacckages to allow apt to use a repository over HTTPS"
sudo apt-get install -y --no-install-recommends apt-transport-https ca-certificates curl software-properties-common

# add dockers official GPG key
echo -e "${CYAN}===> Adding Docker's official GPG key"
curl -fsSL https://apt.dockerproject.org/gpg | sudo apt-key add -

# verify the key id
echo -e "${CYAN}===> Verifying that key ID"
# apt-key fingerprint 58118E89F3A912897C070ADBF76221572C52609D
echo -e "${CYAN}====> Adding Docker to users"
sudo usermod -aG docker $(whoami)

# add stable repo
echo -e "${CYAN}===> Adding stable repository"
sudo add-apt-repository "deb https://apt.dockerproject.org/repo/ ubuntu-$(lsb_release -cs) main"

# install docker
echo -e "${CYAN}===> Installing Docker"
sudo apt-get update
sudo apt-get -y install docker-engine

echo -e "${CYAN}===> Installing docker-compose"
sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# installing postgres
echo -e "${CYAN}===> Installing Postgres"
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib postgis

# create a super user for postgres
echo -e "${CYAN}===> Download postgres database dump"
wget https://cdn.patricktriest.com/atlas-of-thrones/atlas_of_thrones.sql

echo -e "${CYAN}===> Create database and user"
sudo -u postgres createdb thrones_atlas
# user will be allowed to create databases
sudo -u postgres createuser -s username=nightking -d
sudo -u postgres psql -d thones_atlas < atlas_of_thrones.sql

# Installing Redis
echo -e "${CYAN}===> Installing Redis"
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make