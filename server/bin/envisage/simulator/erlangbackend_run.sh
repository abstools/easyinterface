#!/bin/bash

streamroot=$1
execid=$2
timeout=$3
refresh=$4

envisage/simulator/erlangbackend_stats.sh $streamroot $execid $refresh &> /dev/null &

(cd $streamroot/erlang; env HOME=/tmp timeout $3 ./run -p 8080) | misc/console_stream.sh $streamroot 100 "out" &> /dev/null
touch $streamroot/terminated
