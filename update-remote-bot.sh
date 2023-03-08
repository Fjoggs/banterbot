#!/bin/bash - 
#===============================================================================
#
#          FILE: update-remote-bot.sh
# 
#         USAGE: ./update-remote-bot.sh 
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: YOUR NAME (), 
#  ORGANIZATION: 
#       CREATED: 05. nov. 2021 22:09
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error
rsync -av --exclude 'banterbot-database.db' ~/projects/banterbot/ fjoggs@anno1337.com:~/banterbot

