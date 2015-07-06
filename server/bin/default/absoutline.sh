#! /bin/bash

. `dirname $0`/parseparams.sh

absfrontend=`dirname $0`/absfrontend.jar

java -jar $absfrontend -outline $files 2> $rootdir/outlineerrors

if [ $? == 1 ]; then
    echo "<error>"
    cat $rootdir/outlineerrors
    echo "</error>"
fi
