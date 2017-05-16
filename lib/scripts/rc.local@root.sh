#!/usr/bin/env bash
#
# description:
#     generate commands into rc.local safe for device reboot
# useage:
#     sudo bash rc.local@root.sh
#

if [[ ! -f ".current-app" ]]; then
  echo "EXIT: $(pwd) not in unicorn server project path."
  exit
fi

if [[ ! -f ".app-user" ]]; then
  echo "EXIT: EXIT: miss dependency - \`.app-user\`"
  exit
fi

app_user="$(cat .app-user)"
rc_local=/etc/rc.d/rc.local
if [[ -f ${rc_local} ]]; then
  lib_scripts_path=$(pwd)/lib/scripts
  cat <<EOF >> ${rc_local}
# Begin generated scripts for: $(pwd)/$0

/bin/bash ${lib_scripts_path}/nginx_defender.sh
cd $(pwd) && sudo -u ${app_user} /bin/bash tool.sh app:defender
cd $(pwd) && sudo -u ${app_user} /bin/bash tool.sh crontab:update

# End generated scripts for: $(pwd)/$0
EOF

   tail ${rc_local}
else
  echo "warning: ${rc_local} not exist"
fi
