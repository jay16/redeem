#!/usr/bin/env bash
#
# description:
#     generate commands into rc.local safe for device reboot
# useage:
#     sudo bash daemon@root.sh
#
if [[ ! -f ".app-user" ]]; then
  echo "EXIT: miss dependency - \`.app-user\`"
  exit
fi

app_root="$(pwd)"
app_user="$(cat .app-user)"
app_name="${app_root##*/}"
daemon_bash="/etc/rc.d/daemon@${app_name}.sh"
cat <<EOF > ${daemon_bash}
$(which service) mysql start

$(which iptables) -F
$(which iptables) -X

# /bin/bash ${lib_scripts_path}/nginx_defender.sh
cd $(pwd) && sudo -u ${app_user} $(which bash) tool.sh app:defender
cd $(pwd) && sudo -u ${app_user} $(which bash) tool.sh crontab:update
EOF

echo "generage ${daemon_bash} $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')"

crontab_conf="/etc/rc.d/crontab@${app_name}.conf"
cat <<EOF > ${crontab_conf}
0 */1 * * * $(which echo) 1 > /proc/sys/vm/drop_caches
*/1 * * * * $(which bash) ${daemon_bash} >> $(pwd)/log/daemon.log 2>&1
EOF

echo "generage ${crontab_conf} $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')"

rc_local="/etc/rc.d/rc.local"
cat <<EOF >> ${rc_local}

# ${app_name}@$(date)

$(which bash) ${daemon_bash}
$(which crontab) ${crontab_conf}

# ${app_name}@$(date)
EOF

echo "appended ${rc_local} $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')"
