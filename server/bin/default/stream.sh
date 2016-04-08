#!/bin/bash

SPECIAL_PATH=$1
PATH2=$1


COUNT=1
while [ $COUNT -le 100 ] 
do

for file in $SPECIAL_PATH/*.tmp; do

    cp $file $PATH2/$COUNT.ei    
    cp $file $PATH2/$COUNT.html

    COUNT=$(( $COUNT + 1 ))
    sleep 2
done
for file in $SPECIAL_PATH/*.tmpgh; do

    cp $file $PATH2/$COUNT.ei
    cp $file $PATH2/$COUNT.gh

    COUNT=$(( $COUNT + 1 ))
    sleep 2
done

    sleep 4
done

touch $1/terminated
