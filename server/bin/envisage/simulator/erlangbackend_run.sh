#!/bin/bash

streamroot=$1
execid=$2
timeout=$3
refresh=$4
enablestats=$5
port=`misc/freeport.sh 8080`

if [ $enablestats == "yes" ]; then
    envisage/simulator/erlangbackend_stats.sh $streamroot $execid $refresh $port&> /dev/null &
fi

(cd $streamroot/erlang; env HOME=/tmp timeout $3 ./run -p $port) | misc/console_stream.sh $streamroot 100 "out" &> /dev/null
touch $streamroot/terminated
