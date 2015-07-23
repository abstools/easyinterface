#!/bin/bash

. envisage/envisage_settings.sh

java -jar $ABSFRONTEND -outline $@ 2> /tmp/absoutline.stderr

if [ $? == 1 ]; then
    echo "<ei_error>"
    cat /tmp/absoutline.stderr
    echo "</ei_error>"
fi

\rm -f /tmp/absoutline.stderr
