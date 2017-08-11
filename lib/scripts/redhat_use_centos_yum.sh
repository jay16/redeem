#!/usr/bin/env bash
#
# referenced: http://blog.csdn.net/w1573007/article/details/66968944?utm_source=itdadao&utm_medium=referral
#
mkdir -p ~/yum-tools
rm -fr ~/yum-tools/*.rpm

cd ~/yum-tools

echo "## remove load yum source"
rpm -qa | grep yum | xargs rpm -e --nodeps

echo "## download yum within centos 7.3.1611"
wget http://mirrors.163.com/centos/7.3.1611/os/x86_64/Packages/yum-plugin-fastestmirror-1.1.31-40.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.3.1611/os/x86_64/Packages/yum-updateonboot-1.1.31-40.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.3.1611/os/x86_64/Packages/yum-utils-1.1.31-40.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.3.1611/os/x86_64/Packages/yum-metadata-parser-1.1.4-10.el7.x86_64.rpm
wget http://mirrors.163.com/centos/7.3.1611/os/x86_64/Packages/yum-3.4.3-150.el7.centos.noarch.rpm

echo "## install new yum source"
rpm -ivh yum-*


echo "## backup already existed repo files"
cd /etc/yum.repos.d/
for repo in $(ls *.repo)
do
    cp "${repo}" "${repo}.bk"
done

echo "## generate centos repo file"
cd ~
cp Centos-Base.repo /etc/yum.repos.d/

echo "## yum clean cache and update"
yum clean all
yum update
yum makecache
