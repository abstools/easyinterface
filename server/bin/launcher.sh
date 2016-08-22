#!/bin/bash


timeout=$1
numproc=$2
logfile=$3

ulimit -t $timeout #-u $numproc
echo "EXEC ${@:4}" >> $logfile
${@:4}

