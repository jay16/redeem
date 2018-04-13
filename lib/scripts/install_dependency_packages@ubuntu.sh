#!/usr/bin/env bash
#
echo "## apt-get update"
apt-get update -y

echo "## install dependency packages"
packages=(git git-core git-doc lsb-release curl libreadline-dev libcurl4-gnutls-dev libssl-dev libexpat1-dev gettext libz-dev tree mysql-server mysql-client libmysqlclient-dev language-pack-zh-hant language-pack-zh-hans)
for package in ${packages[@]}; do
    printf "installing ${package}..."
    apt-get build-dep -y ${package} > /dev/null 2>&1
    apt-get install -y ${package} > /dev/null 2>&1
    printf " $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')\n"
done