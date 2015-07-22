#!/bin/bash

### A wrapper script for SACO's MHP analysis
###
###

# execute saco_settings.sh to set some environment variables needed by
# costabs, etc.
#
. `dirname $0`/../envisage_settings.sh

# Execute mh_shell, we add '-ei_version 2' to the parameters since now
# saco's output uses the old easy interface language
#
${SACOHOME}/src/interfaces/deadlock/shell/deadlock_shell $@ -ei_version 2 &> /tmp/deadlock.stderr

# If costabs exit with exit-code 0 we just print the output to the
# stdout, otheriwse we print an error message to the stdout as well.
#
if [ $? == 0 ]; then
    cat /tmp/costabs/output.xml
else
    echo "<eierror>"
    echo "Error occurred while executing deadlock analysis:"
    echo ""
    cat /tmp/deadlock.stderr
    echo "</eierror>"
fi

\rm -f /tmp/deadlock.stderr
