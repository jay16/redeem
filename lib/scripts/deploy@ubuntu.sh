#!/usr/bin/env bash
#
echo "## install readline-devel mysql-devel nginx gcc-c++"
# sudo yum install -y vim redhat-lsb git wget bzip2 readline-devel mysql-devel nginx gcc-c++

sudo apt-get build-dep git-core git-doc
sudo apt-get install -y git lsb-release curl libreadline-dev libcurl4-gnutls-dev libssl-dev libexpat1-dev gettext libz-dev

echo "## install redis"
mkdir -p tool/
cd tool/
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo cp src/redis-server /usr/local/bin/
sudo cp src/redis-cli /usr/local/bin/
cd ../../

echo "## install rbenv and dependency"
git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
git clone git://github.com/sstephenson/rbenv-gem-rehash.git ~/.rbenv/plugins/rbenv-gem-rehash
git clone https://github.com/rkh/rbenv-update.git ~/.rbenv/plugins/rbenv-update
git clone https://github.com/andorchen/rbenv-china-mirror.git ~/.rbenv/plugins/rbenv-china-mirror
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
source ~/.bash_profile
type rbenv

echo "## install ruby#2.4.0"
rbenv install 2.4.0
rbenv global 2.4.0

gem install bundle
bundle config mirror.https://rubygems.org https://gems.ruby-china.org

echo "## git clone and bundle"
[[ -d /home/www ]] || mkdir /home/www
cd /home/www
[[ -d wutian-search ]] || git clone https://github.com/jay16/wutian-search

cd wutian-search
rbenv local 2.3.0
gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
bundle config mirror.https://rubygems.org https://gems.ruby-china.org
bundle install
