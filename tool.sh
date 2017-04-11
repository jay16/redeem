#!/usr/bin/env bash

bundle_command=$(rbenv which bundle)
gem_command=$(rbenv which gem)
unicorn_default_port=$(cat .unicorn-port)
unicorn_port=${2:-${unicorn_default_port}}
unicorn_env=${3:-'production'}
unicorn_config_file=config/unicorn.rb

unicorn_pid_file=tmp/pids/unicorn.pid

# user bash environment for crontab job.
# shell_used=${SHELL##*/}
app_root_path=$(pwd)
shell_used='bash'
[[ $(uname -s) = Darwin ]] && shell_used='zsh'

mkdir -p {db,log,tmp/{pids,rb},public} > /dev/null 2>&1
[[ -f ~/.${shell_used}rc ]] && source ~/.${shell_used}rc &> /dev/null
[[ -f ~/.${shell_used}_profile ]] && source ~/.${shell_used}_profile &> /dev/null
export LANG=zh_CN.UTF-8


process_start() {
    local pid_file="$1"
    local process_name="$2"
    local command_text="$3"

    echo "## start ${process_name}"
    if [[ -f ${pid_file} ]]; then
        local pid=$(cat ${pid_file})
        /bin/ps ax | awk '{print $1}' | grep -e "^${pid}$" &> /dev/null
        if [[ $? -gt 0 ]]; then
            echo "${process_name} not running then remove ${pid_file}"
            [[ -f ${pid_file} ]] && rm -f ${pid_file} &> /dev/null
        fi

        echo -e "\t ${process_name} already started"
        exit 0
    fi

    echo -e "\t$ run \`${command_text}\`"
    run_result=$($command_text) #> /dev/null 2>&1
    echo -e "\t# ${process_name} start $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')(${run_result})"
}

process_stop() {
    local pid_file="$1"
    local process_name="$2"
    local exec_status='failed'
    echo "## stop ${process_name}"

    if [[ ! -f ${pid_file} ]]; then
        echo -e "\t ${process_name} never started"
        exit 1
    fi

    cat "${pid_file}" | xargs -I pid kill -QUIT pid
    if [[ $? -eq 0  ]]; then
        rm -f ${pid_file} &> /dev/null
        exec_status='successfully'
    fi
    echo -e "\t ${process_name} stop ${exec_status}"
}

process_checker() {
    local pid_file="$1"
    local process_name="$2"

    if [[ ! -f ${pid_file} ]]; then
        echo "process(${process_name}): pid file not exist - ${pid_file}"
        return 1
    fi

    local pid=$(cat ${pid_file})
    ps ax | awk '{print $1}' | grep -e "^${pid}$" &> /dev/null
    if [[ $? -gt 0 ]]; then
        echo "process(${process_name}) is not running"
        [[ -f ${pid_file} ]] && rm -f ${pid_file} &> /dev/null
        return 2
    fi

    echo "process(${process_name}) is running"
    return 0
}


cd "${app_root_path}" || exit 1
case "$1" in
    start)
        echo "## shell used: ${shell_used}"
        command_text="$bundle_command exec unicorn -c ${unicorn_config_file} -p ${unicorn_port} -E ${unicorn_env} -D"
        process_start "${unicorn_pid_file}" 'unicorn' "${command_text}"
        echo -e "\t# port: ${unicorn_port}, environment: ${unicorn_env}"
    ;;

    stop)
        process_stop "${unicorn_pid_file}" 'unicorn'
    ;;

    restart)
        /bin/cat "${unicorn_pid_file}" | xargs -I pid kill -USR2 pid
    ;;

    restart:force)
        /bin/bash "$0" stop
        /bin/sleep 1
        echo -e '\n\n#-----------command sparate line----------\n\n'
        /bin/bash "$0" start
    ;;
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
