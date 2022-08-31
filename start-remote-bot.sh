#!/bin/bash - 
#===============================================================================
#
#          FILE: start-remote-bot.sh
# 
#         USAGE: ./start-remote-bot.sh 
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: YOUR NAME (), 
#  ORGANIZATION: 
#       CREATED: 03. aug. 2022 22:08
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error
ssh fjoggs@anno1337.com 'bash -s < ~/banterbot/start-bot.sh'

