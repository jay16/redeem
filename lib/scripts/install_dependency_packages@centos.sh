#!/usr/bin/env bash
#
echo "## yum update"
yum update -y

echo "## install dependency packages"
packages=(git vim  wget bzip2 gcc gcc-c++ automake autoconf libtool make openssl openssl-devel readline-devel zlib-devel readline-devel mysql-devel mysql nginx libxslt-devel.x86_64 libxml2-devel.x86_64 tree)
for package in ${packages[@]}; do
    printf  "installing ${package}..."
    yum install -y ${package} > /dev/null 2>&1
    printf  " $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')\n"
done