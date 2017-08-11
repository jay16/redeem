#!/usr/bin/env bash
#
# http://tieba.baidu.com/p/4732158305
wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
sudo rpm -ivh mysql-community-release-el7-5.noarch.rpm
sudo yum install mysql-server

sudo chown -R hd:hd /var/lib/mysql
service mysqld restart

mysql -u root
mysql > use mysql;
mysql > update user set password=password('root@123') where user='root';
mysql > flush privileges;
mysql > exit;
