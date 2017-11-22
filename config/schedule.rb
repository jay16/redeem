# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

job_type :command_within_app, 'cd :path && :task :output'

every :day, at: '00:00am' do
  command_within_app '/bin/bash lib/scripts/crontab_jobs.sh 00:00 >> log/crontab/jobs_00_00.log 2>&1'
end

every '*/1 * * * *' do
  command_within_app '/bin/bash lib/scripts/crontab_jobs.sh 01:minutes >> log/crontab/jobs_01_minutes.log 2>&1'
end
