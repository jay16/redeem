#!/usr/bin/env bash
#
# Description: crontab jobs command control with params
# Author: jay@17/03/14
#
# Usage:
# ./crontab_jobs.sh {0015,0300,1:hour,5:minutes}
#
case "$1" in
  1:minutes)
    RACK_ENV=production bundle exec rake redis:weixin:access_token
    ;;

  *)
    echo "$(date) - unkown params: $1"
    ;;
esac
