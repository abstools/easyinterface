#! /bin/bash

. `dirname $0`/../envisage_settings.sh  # this file is located in server/bin/envisage

java -jar $ABSFRONTEND -outline $@ 2> /tmp/absoutline.stderr

if [ $? == 1 ]; then
    echo "<eierror>"
    cat /tmp/absoutline.stderr
    echo "</eierror>"
fi

\rm -f /tmp/absoutline.stderr
