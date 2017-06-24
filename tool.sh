#!/usr/bin/env bash
#
# Description: script jobs around unicorn/redis/sidekiq/mysql
# Author: jay@16/02/03
#
# Usage:
# ./tool.sh {config|start|stop|start_redis|stop_redis|restart|deploy|update_assets|import_data|copy_data}
#

source lib/scripts/toolsh_common_functions.sh

exit_when_miss_dependency '.app-user'
exit_when_miss_dependency '.app-port'

#
# tool kit logic
#

app_default_port=$(cat .app-port)
app_port=${2:-${app_default_port}}
app_env=${3:-'production'}
app_user=$(cat .app-user)

if [[ "$(whoami)" != "${app_user}" ]]; then
    echo "EXIT: expect \`${app_user}\` to run app, but \`$(whoami)\`!"
    exit 1
fi

unicorn_config_file=config/unicorn.rb
unicorn_pid_file=tmp/pids/unicorn.pid
sidekiq_pid_file=tmp/pids/sidekiq.pid
redis_pid_file=tmp/pids/redis.pid
app_root_path="$(pwd)"

# user bash environment for crontab job.
# default `bash` when SHELL not set
shell_used=${SHELL##*/}
shell_used=${shell_used:-'bash'}

[[ -f ~/.${shell_used}rc ]] && source ~/.${shell_used}rc &> /dev/null
[[ -f ~/.${shell_used}_profile ]] && source ~/.${shell_used}_profile &> /dev/null
export LANG=zh_CN.UTF-8

bundle_command=$(rbenv which bundle)
gem_command=$(rbenv which gem)

cd "${app_root_path}" || exit 1
mkdir -p {db,log/crontab,tmp/{pids,rb},public} > /dev/null 2>&1

case "$1" in
    config)
        if [[ ! -f db/backup.sh ]]; then
            RACK_ENV=${app_env} $bundle_command exec rake g:script:backup:mysql_and_redis
            echo -e "\tgenerate db/backup.sh $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')"
        fi
        if [[ ! -f log/backup.sh ]]; then
            RACK_ENV=${app_env} $bundle_command exec rake g:script:backup:log
            echo -e "\tgenerate log/backup.sh $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')"
        fi
        if [[ ! -f config/redis.conf ]]; then
            RACK_ENV=${app_env} $bundle_command exec rake redis:generate_config
            echo -e "\tgenerate config/redis.conf $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')"
        fi
    ;;
    process:defender)
        process_checker "${redis_pid_file}" 'redis'
        process_checker "${sidekiq_pid_file}" 'sidekiq'
        process_checker "${unicorn_pid_file}" 'unicorn'
    ;;
    app:defender|ad)
        echo -e $(date "+## app defender at %y-%m-%d %H:%M:%S\n")
        /bin/bash "$0" process:defender
        /bin/bash "$0" start
    ;;
    start)
        echo "## shell used: ${shell_used}"
        RACK_ENV=production $bundle_command exec rake boom:setting
        /bin/bash "$0" config
        /bin/bash "$0" redis:start
        /bin/bash "$0" sidekiq:start
        command_text="$bundle_command exec unicorn -c ${unicorn_config_file} -p ${app_port} -E ${app_env} -D"
        process_start "${unicorn_pid_file}" 'unicorn' "${command_text}"
        echo -e "\t# port: ${app_port}, environment: ${app_env}"

        RACK_ENV=production $bundle_command exec whenever --update-crontab
    ;;
    stop)
        process_stop "${unicorn_pid_file}" 'unicorn'
    ;;
    restart)
        /bin/cat "${unicorn_pid_file}" | xargs -I pid kill -USR2 pid
    ;;
    restart:force)
        /bin/bash "$0" stop
        /bin/bash "$0" redis:stop
        /bin/bash "$0" sidekiq:stop
        /bin/sleep 1
        echo -e '\n\n#-----------command sparate line----------\n\n'
        /bin/bash "$0" start
    ;;
    sidekiq:start)
        command_text="${bundle_command} exec sidekiq -r ./config/boot.rb -C ./config/sidekiq.yaml -e ${app_env} -d"
        process_start "${sidekiq_pid_file}" 'sidekiq' "${command_text}"
    ;;
    sidekiq:stop)
        process_stop "${sidekiq_pid_file}" 'sidekiq'
    ;;
    sidekiq:restart)
        /bin/bash "$0" sidekiq:stop
        /bin/sleep 1
        echo -e '\n\n#-----------command sparate line----------\n\n'
        /bin/bash "$0" sidekiq:start
    ;;
    redis:start)
        process_start "${redis_pid_file}" 'redis' 'redis-server ./config/redis.conf'
    ;;
    redis:stop)
        process_stop "${redis_pid_file}" 'redis'
    ;;
    redis:restart)
        /bin/bash "$0" redis:stop
        /bin/sleep 1
        echo -e '\n\n#-----------command sparate line----------\n\n'
        /bin/bash "$0" redis:start
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
            echo "WARNING: please git push local modified!"
            exit 1
        fi
        /bin/bash "$0" git:pull
        /bin/bash "$0" crontab:update
    ;;
    deploy:server:auto|dsa)
        /bin/bash "$0" deploy:server
        [[ $? -gt 0 ]] && exit 1

        /bin/bash "$0" restart:force
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
         /bin/bash "$0" git:push
    ;;
    pages)
        bash lib/scripts/offline_pages.sh
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

        /bin/bash "$0" match:params
        exit 2
    ;;
esac
