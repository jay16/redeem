#!/usr/bin/env bash

echo '0 */1 * * * /bin/echo 1 > /proc/sys/vm/drop_caches'
