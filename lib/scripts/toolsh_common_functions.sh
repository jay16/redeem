#!/usr/bin/env bash
#
# version: 0.0.1
#
# updated@170523: optimized `check_redis_process_running` with `grep -v $0`
#
exit_when_miss_dependency() {
    local depended_file="$1"
    local prompt_message="$2"
    if [[ ! -f "${depended_file}" ]]; then
        echo "EXIT: miss dependency - \`${depended_file}\`"
        [[ ! -z "${prompt_message}" ]] && echo "${prompt_message}"

        exit 1
    fi
}

check_redis_process_running() {
    local pid_file="$1"
    running_pid="$(ps aux | grep redis | grep -v grep | grep -v "$0" | awk '{ print pids=pids" "$2 } END { print pids }' | tail -n 1 | sed s/[[:space:]]//g)"
    if [[ -z "${running_pid}" ]]; then
        echo "process(${process_name}): also no find running pid"
        return 1
    else
        echo "${running_pid}" > "${pid_file}"
        echo "process(${process_name}): find running pid(${running_pid}) and rewrite to ${pid_file}"
        return 0
    fi
}

process_start() {
    local pid_file="$1"
    local process_name="$2"
    local command_text="$3"

    if [[ -f ${pid_file} ]]; then
        local pid=$(cat ${pid_file})
        /bin/ps ax | awk '{print $1}' | grep -e "^${pid}$" &> /dev/null
        if [[ $? -eq 0 ]]; then
            printf "$two_cols_table_format" "${process_name}" "running(${pid})"
            return 0
        fi

        printf "$two_cols_table_format" "${process_name}" "not exist: ${pid_file}"
        [[ -f ${pid_file} ]] && rm -f ${pid_file} &> /dev/null
    fi

    # step here the pid file must not exists
    # donnot attemp to startup multiple redis processes
    if [[ "${process_name}" = "redis" ]]; then
        check_redis_process_running "${pid_file}"
        # redis process already exist then exit
        [[ $? -eq 0 ]] && return 0
    fi

    run_result=$($command_text) #> /dev/null 2>&1
    run_result_text="$([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')(${run_result})"

    printf "$two_cols_table_format" "${process_name}" "run ${run_result_text}"
    # echo -e "$ run \`${command_text}\`"
}

process_stop() {
    local pid_file="$1"
    local process_name="$2"
    local exec_status='failed'

    if [[ ! -f ${pid_file} ]]; then
        echo -e "${process_name} never started"
        return 1
    fi

    cat "${pid_file}" | xargs -I pid kill -QUIT pid
    if [[ $? -eq 0  ]]; then
        rm -f ${pid_file} &> /dev/null
        exec_status='successfully'
    fi
    echo -e "${process_name} stop ${exec_status}"
}

process_checker() {
    local pid_file="$1"
    local process_name="$2"

    if [[ ! -f "${pid_file}" ]]; then
        printf "$two_cols_table_format" "${process_name}" "not exist: ${pid_file}"

        # donnot attemp to startup multiple redis processes
        if [[ "${process_name}" = "redis" ]]; then
            check_redis_process_running "${pid_file}"
            # redis process already exist then return
            [[ $? -eq 0 ]] && return 0
        fi
    fi
    [[ ! -f "${pid_file}" ]] && return 1

    local pid=$(cat ${pid_file})
    ps ax | awk '{print $1}' | grep -e "^${pid}$" &> /dev/null
    if [[ $? -gt 0 ]]; then
        printf "$two_cols_table_format" "${process_name}" "not running"
        [[ -f ${pid_file} ]] && rm -f ${pid_file} &> /dev/null
        return 2
    fi

    printf "$two_cols_table_format" "${process_name}" "running($pid)"
    return 0
}

mobile_asset_check() {
    local current_app=$(cat .current-app)
    local asset_name="$1"
    local zip_path="public/mobile_assets/${current_app}/${asset_name}.zip"

    if [[ -f ${zip_path} ]]; then
        cp -p ${zip_path} public/${asset_name}.zip
    else
        echo "WARNING: ${zip_path} not found"
    fi
}

check_app_defenders_include() {
    if [[ $(grep "$1" .app-defender | wc -l) -eq 0 ]]; then
       return 404
    else
       return 0
    fi
}

two_cols_table_divider=------------------------------
two_cols_table_divider=$two_cols_table_divider$two_cols_table_divider
two_cols_table_header="+%-14.14s+%-42.42s+\n"
two_cols_table_format="| %-12s | %-40s |\n"
two_cols_table_width=59

fun_print_table_header() {
    local header_text="${1}"
    
    printf "$two_cols_table_header" "$two_cols_table_divider" "$two_cols_table_divider"
    printf "| %-55s |\n" "${header_text}"
    printf "$two_cols_table_header" "$two_cols_table_divider" "$two_cols_table_divider"
    printf "$two_cols_table_format" "$2" "$3"
    printf "$two_cols_table_header" "$two_cols_table_divider" "$two_cols_table_divider"
}

fun_print_table_footer() {
    local footer_text="${1-timestamp: $(date +'%Y-%m-%d %H:%M:%S')}"

    printf "$two_cols_table_header" "$two_cols_table_divider" "$two_cols_table_divider"
    printf "| %-55s |\n" "${footer_text}"
    printf "$two_cols_table_header" "$two_cols_table_divider" "$two_cols_table_divider"
}