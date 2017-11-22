#!/usr/bin/env bash
#
# Description: crontab jobs command control with params
# Author: jay@17/05/13
#
# Usage:
# ./crontab_jobs.sh {0015,0300,1:hour,5:minutes}

case "$1" in
  00:00)
      RACK_ENV=production bundle exec rake hd:crm:sync_stores
      RACK_ENV=production bundle exec rake doctor:data:signature
  ;;
  01:minutes)
      /bin/bash tool.sh app:defender
  ;;
  *)
      echo "$(date) - unkown params: $1"
  ;;
esac
