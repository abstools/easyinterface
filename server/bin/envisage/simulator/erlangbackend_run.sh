#!/bin/bash

streamroot=$1
execid=$2
timeout=$3

(cd $streamroot/erlang; env HOME=/tmp timeout $3 ./run) | misc/console_stream.sh $streamroot 100 &> /dev/null
touch $streamroot/terminated
