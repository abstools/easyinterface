#!/bin/bash

PID=$1
if [ -z $PID ];
then
    echo "No pid specified"
fi

PPLIST=$PID
CHILD_LIST=`pgrep -P $PPLIST -d,`

while [ ! -z "$CHILD_LIST" ]
do
    PPLIST="$PPLIST,$CHILD_LIST"
    CHILD_LIST=`pgrep -P $CHILD_LIST -d,`
done

SIGNAL=$2

if [ -z $SIGNAL ]
then
    SIGNAL="TERM"
fi
#do substring from comma to space
kill -$SIGNAL ${PPLIST//,/ }
