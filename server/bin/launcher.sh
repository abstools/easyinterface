#!/bin/bash


timeout=$1
numproc=$2
# ignore `logfile' since by default it's in a non-writable directory.
# Instead, log to stderr so we can see it in the container logs.
logfile=$3

ulimit -t $timeout #-u $numproc
# echo "EXEC ${@:4}" >> $logfile
echo "EXEC ${@:4}" >&2
${@:4}

