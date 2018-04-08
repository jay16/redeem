#!/usr/bin/env bash
#
# Description: script jobs around unicorn/redis/mysql
# Author: jay@16/02/03
#
# Usage:
# ./tool.sh {config|start|stop|start_redis|stop_redis|restart|deploy|update_assets|import_data|copy_data}
#


#
# script env
#
app_root_path="$(pwd)"
export LANG=zh_CN.UTF-8
while read filepath; do
    test -f "${filepath}" && source "${filepath}"
done < .env-files
source lib/scripts/toolsh_common_functions.sh
cd ${app_root_path}

#
# tool kit logic
#
exit_when_miss_dependency '.app-user'     'echo $(whoami) > .app-user'
exit_when_miss_dependency '.app-port'     'echo 4567 > .app-port'
exit_when_miss_dependency '.env-files'    "echo ${HOME}/.${SHELL##*/}_profile >> .env-files"

app_default_port=$(cat .app-port)
app_port=${2:-${app_default_port}}
app_env=${3:-'production'}
app_user=$(cat .app-user)

if [[ "$(whoami)" != "${app_user}" ]]; then
    echo "EXIT: expect \`${app_user}\` to run app, but \`$(whoami)\`!" && exit 1
fi

unicorn_config_file=config/unicorn.rb
unicorn_pid_file=tmp/pids/unicorn.pid

bundle_command=$(rbenv which bundle)
gem_command=$(rbenv which gem)

case "$1" in
    commands:version|cv)
        while read filepath; do
            test -f "${filepath}" && echo "YES ${filepath}" || echo "NO ${filepath}"
        done < .env-files
        # if [[ $? -ne 0 ]]; then
        #     while read filepath; do
        #         echo "export PATH=\$PATH:/usr/local/bin" >> "${filepath}"
        #     done < .env-files
        # fi

        fun_print_table_header "check dependency commands status" "command" "version/path"
        dependency_commands=(mysql rbenv ruby git)

        check_app_defenders_include "redis" && {
            dependency_commands[${#dependency_commands[@]}]='redis-cli'
            dependency_commands[${#dependency_commands[@]}]='redis-server'
        }

        for cmd in ${dependency_commands[@]}; do
            version=$(${cmd} --version)
            printf "$two_cols_table_format" "${cmd}" "${version:0:40}"
        done

        dependency_commands=(ls rm cp date mkdir bash sleep cat echo crontab which test)
        for cmd in ${dependency_commands[@]}; do
            printf "$two_cols_table_format" "${cmd}" "$(which ${cmd})"
        done

        fun_print_table_footer 
    ;;
    process:defender|pd)
        process_checker "${unicorn_pid_file}" 'unicorn'
    ;;
    app:defender|ad)
        bash "$0" commands:version
        bash "$0" start
        bash "$0" process:defender
    ;;
    start)
        RACK_ENV=production $bundle_command exec rake boom:setting

        fun_print_table_header "start process" "process" "status"

        command_text="$bundle_command exec unicorn -c ${unicorn_config_file} -p ${app_port} -E ${app_env} -D"
        process_start "${unicorn_pid_file}" 'unicorn' "${command_text}"

        fun_print_table_footer

        RACK_ENV=production $bundle_command exec whenever --update-crontab
    ;;
    stop)
        process_stop "${unicorn_pid_file}" 'unicorn'
    ;;
    restart)
        cat "${unicorn_pid_file}" | xargs -I pid kill -USR2 pid
    ;;
    restart:force)
        bash "$0" stop
        sleep 1
        bash "$0" start
    ;;
    crontab:update)
        $bundle_command exec whenever --update-crontab
    ;;
    rspec|spec)
       $bundle_command exec rspec spec/
    ;;
    deploy:server|ds)
        local_modified=$(git status -s)
        if [[ ! -z "${local_modified}" ]]; then
            echo "WARNING: please git push local modified!" && exit 1
        fi
        bash "$0" git:pull
        bash "$0" crontab:update
    ;;
    deploy:server:auto|dsa)
        bash "$0" deploy:server
        [[ $? -gt 0 ]] && exit 1

        bash "$0" restart:force
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
        if [[ -z "$2" ]]; then
            echo "Error: please input commit message"
            exit
        fi
        git add .
        git commit -a -m "$2"
        bash "$0" git:push
    ;;
    pages)
        bash lib/scripts/offline_pages.sh
    ;;
    page:admin)
        if [[ -z "$2" ]]; then
            echo "Error: please input admin page name"
            exit
        fi
        page="$2"
        curl "http://localhost:4567/generate/admin/$page" > public/admin/$page
        sed -i '' s#/javascripts/#assets/javascripts/#g public/admin/$page
        sed -i '' s#/stylesheets/#assets/stylesheets/#g public/admin/$page
        sed -i '' s#/images/#assets/images/#g public/admin/$page
    ;;
    page:ipad)
        if [[ -z "$2" ]]; then
            echo "Error: please input ipad page name"
            exit
        fi
        page="$2"
        curl "http://localhost:4567/generate/ipad/$page" > public/ipad/$page
        sed -i '' s#/javascripts/#assets/javascripts/#g public/ipad/$page
        sed -i '' s#/stylesheets/#assets/stylesheets/#g public/ipad/$page
        sed -i '' s#/images/#assets/images/#g public/ipad/$page
    ;;
    mysql:commands|mc)
      app_env=${2:-'production'}
      RACK_ENV=${app_env} bundle exec rake doctor:mysql:commands
    ;;
    doctor)
      app_env=${2:-'production'}
      RACK_ENV=${app_env} bundle exec rake doctor:mysql:state
      RACK_ENV=${app_env} bundle exec rake doctor:os:date
    ;;
    app:user)
        echo $(whoami) > .app-user
        cat .app-user
    ;;
    match:params|mp)
        $bundle_command exec ruby lib/scripts/match_toolsh_params.rb
    ;;
    *)
        echo "warning: unkown params - $@"
        echo
        echo "Usage:"
        echo "   $0 start ${app_port} ${app_env}"
        echo
        echo "params list: "

        bash "$0" match:params
        exit 2
    ;;
esac
