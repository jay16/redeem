#!/usr/bin/env bash
#
# Description: crontab jobs command control with params
# Author: jay@17/05/13
#
# Usage:
# ./crontab_jobs.sh {0015,0300,1:hour,5:minutes}
#
app_root_path=$(pwd)
shell_used='bash'
[[ $(uname -s) = Darwin ]] && shell_used='zsh'

mkdir -p {db,log/crontab,tmp/{pids,rb},public} > /dev/null 2>&1
[[ -f ~/.${shell_used}rc ]] && source ~/.${shell_used}rc &> /dev/null
[[ -f ~/.${shell_used}_profile ]] && source ~/.${shell_used}_profile &> /dev/null
export LANG=zh_CN.UTF-8

cd "$app_root_path"
case "$1" in
  0000)
      RACK_ENV=production bundle exec rake hd:crm:sync_stores
  ;;

  *)
      echo "$(date) - unkown params: $1"
  ;;
esac
