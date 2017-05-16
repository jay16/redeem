#!/usr/bin/env bash
#
# marke sure nginx startup.
#
# 1. sudo or root
# 2. execute in /etc/rc.d/rc.local
#
nginx_process=$(/bin/ps aux | grep '\bnginx\b' | grep -v grep | wc -l)
echo $nginx_process
if [[ ${nginx_process} -eq 0 ]]; then
  nginx
fi
