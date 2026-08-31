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
rsync -av --exclude 'banterbot-database.db' --exclude 'node_modules/' --exclude 'app-env.ts' ~/projects/banterbot/ fjogen@192.168.88.249:~/projects/banterbot

