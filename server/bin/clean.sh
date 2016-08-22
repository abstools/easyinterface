#!/bin/bash

timeclean=$1
tmpdir=$2
logfile=$3

sleep $timeclean
rm -rf $tmpdir && echo "removed $tmpdir" >> $logfile || echo "ERROR: can not remove $tmpdir" >> $logfile
