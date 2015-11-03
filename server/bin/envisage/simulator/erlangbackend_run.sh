#!/bin/bash

streamroot=$1
execid=$2

(cd $streamroot/erlang; env HOME=/tmp ./run) | misc/console_stream.sh $streamroot 10 $execid  &> /dev/null
touch $streamroot/terminate
