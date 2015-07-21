#! /bin/bash

. ./bin/parseparams.sh  # this file is located in server/bin

absfrontend=/home/genaim/Systems/abstools/frontend/dist/absfrontend.jar

java -jar $absfrontend -outline $files 2> $rootdir/outlineerrors

if [ $? == 1 ]; then
    echo "<eierror>"
    cat $rootdir/outlineerrors
    echo "</eierror>"
fi
