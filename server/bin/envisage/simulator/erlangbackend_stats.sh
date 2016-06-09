#!/bin/bash

streamroot=$1
execid=$2
refresh=$3
port=$4

cd $streamroot


echo "" > data.json.last

while [ 1 ]
do
    wget -q http://localhost:$port/dcs/cpu/data.json || (sleep $refresh; continue)
    diff data.json data.json.last > /dev/null
    if [ $? == 1 ]; then
  	cp -f data.json 1.stat
    fi
    \mv -f data.json data.json.last
    sleep $refresh
done
