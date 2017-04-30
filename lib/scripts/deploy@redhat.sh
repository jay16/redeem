#!/usr/bin/env bash
#
# $ useradd hd
# $ passwd hd
# hd123
#
# $ sudo vim /etc/sudoers
# hd ALL=(ALL) ALL
#
#
echo "## install readline-devel mysql-server mysql-devel nginx gcc-c++"
sudo yum install -y vim redhat-lsb git wget bzip2 readline-devel mysql-devel nginx gcc-c++

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

echo "## install ruby#2.3.0"
rbenv install 2.3.0
rbenv global 2.3.0

gem install bundle
bundle config mirror.https://rubygems.org https://gems.ruby-china.org

echo "## git clone and bundle"
mkdir -p ~/www
cd ~/www
[[ -d redeem ]] || git clone https://github.com/jay16/redeem

cd redeem
rbenv local 2.3.0
gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
bundle config mirror.https://rubygems.org https://gems.ruby-china.org
bundle install
