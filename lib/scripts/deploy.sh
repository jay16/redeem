#!/usr/bin/env bash
#

command -v lsb_release > /dev/null || {
    command -v yum > /dev/null && yum install -y redhat-lsb
    command -v apt-get > /dev/null && apt-get install -y lsb-release
}
system=$(lsb_release -i | awk '{ print $3 }' | tr 'A-Z' 'a-z')
version=$(lsb_release -r | awk '{ print $2 }' | awk -F . '{print $1 }')
echo "# ${system}@${version}"

echo "## install rbenv and dependency"
command -v rbenv >/dev/null 2>&1 && { rbenv -v; type rbenv; } || { 
    git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
    git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
    git clone git://github.com/sstephenson/rbenv-gem-rehash.git ~/.rbenv/plugins/rbenv-gem-rehash
    git clone https://github.com/rkh/rbenv-update.git ~/.rbenv/plugins/rbenv-update
    git clone https://github.com/andorchen/rbenv-china-mirror.git ~/.rbenv/plugins/rbenv-china-mirror
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
    echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
    source ~/.bash_profile
    type rbenv
}

echo "## install ruby#2.4.0"
command -v ruby >/dev/null 2>&1 && ruby -v || { 
    rbenv install 2.4.0
    rbenv rehash
    rbenv global 2.4.0
}

gem install bundle
bundle config mirror.https://rubygems.org https://gems.ruby-china.org
bundle config build.nokogiri --use-system-libraries

echo "## git clone and bundle"
[[ -d ~/www/redeem ]] || {
    mkdir -p ~/www && cd ~/www
    git clone --branch feat-sinatra-v2.0 --depth 1 https://github.com/jay16/redeem.git
    cd redeem
    rbenv local 2.3.0
    bundle install
} && {
    cd ~/www/redeem
    bash tool.sh git:pull
    bundle install
}