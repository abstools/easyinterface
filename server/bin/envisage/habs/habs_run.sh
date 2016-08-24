#!/bin/bash

execroot=$1
execid=$2
timeout=$3
refresh=$4
mainprog=$5
streamroot="$execroot/_ei_stream"

(cd $execroot/_ei_tmp; timeout $3 ./$mainprog) | misc/console_stream.sh $streamroot 100 "out" &> /dev/null
touch $streamroot/terminated
