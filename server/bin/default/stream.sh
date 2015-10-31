#!/bin/bash

SPECIAL_PATH=$1/commands
PATH2=$1

echo $$ > $1/pid 

COUNT=1
while [ $COUNT -le 100 ] 
do

for file in $SPECIAL_PATH/*.tmp; do

    cp $file $PATH2/$COUNT.ei

    COUNT=$(( $COUNT + 1 ))
    
done
    sleep 1
done

touch $1/terminate
