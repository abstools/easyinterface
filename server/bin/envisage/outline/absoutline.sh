#! /bin/bash

. envisage/envisage_settings.sh

java -jar $ABSFRONTEND -outline $@ 2> /tmp/absoutline.stderr

if [ $? == 1 ]; then
    echo "<eierror>"
    cat /tmp/absoutline.stderr
    echo "</eierror>"
fi

\rm -f /tmp/absoutline.stderr
