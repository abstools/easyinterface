#!/bin/bash

port=$1
status=0
while [ $status == 0 ]
do
    ((port++))
    status=`nc -z localhost $port >& /dev/null ; echo $?`
done

echo $port
