#! /bin/bash

. envisage/envisage_settings.sh

$ABSTOOLSHOME/frontend/bin/bash/dsaTester $@ 2> /tmp/dsa.stderr

if [ $? == 1 ]; then
    echo "<ei_error>"
    cat /tmp/dsa.stderr
    echo "</ei_error>"
fi

rm -f /tmp/dsa.stderr
