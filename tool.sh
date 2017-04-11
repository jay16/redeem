#!/usr/bin/env bash

bundle_command=$(rbenv which bundle)
gem_command=$(rbenv which gem)

# user bash environment for crontab job.
# shell_used=${SHELL##*/}
app_root_path=$(pwd)
shell_used='bash'
[[ $(uname -s) = Darwin ]] && shell_used='zsh'

mkdir -p tmp/rb
[[ -f ~/.${shell_used}rc ]] && source ~/.${shell_used}rc &> /dev/null
[[ -f ~/.${shell_used}_profile ]] && source ~/.${shell_used}_profile &> /dev/null
export LANG=zh_CN.UTF-8

cd "${app_root_path}" || exit 1
case "$1" in
    rspec|spec)
       $bundle_command exec rspec spec/
    ;;
    deploy:remote|dr)
        $bundle_command install
        echo $bundle_command
        RACK_ENV=production $bundle_command exec rake remote:deploy
    ;;
    deploy:server|ds)
        git checkout ./
        /bin/bash "$0" git:pull
    ;;

    git:push)
        git_current_branch=$(git rev-parse --abbrev-ref HEAD)
        git push origin ${git_current_branch}
    ;;
    git:pull)
        git_current_branch=$(git rev-parse --abbrev-ref HEAD)
        git pull origin ${git_current_branch}
    ;;
    git:auto)
        if [[ -z "$2" ]];
        then
            echo "Error: please input commit message"
            exit
        fi
        git add .
        git commit -a -m "$2"
         /bin/bash "$0" git:push
    ;;

    *)
        echo "Usage: $SCRIPTNAME {config|start|stop|start_redis|stop_redis|restart|deploy}" >&2
        exit 2
    ;;
esac
