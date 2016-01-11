#!/bin/bash

### A wrapper script for SACO's Deadlock Analysis
###
###

# execute environment_settings.sh to set some environment variables
# needed by costabs, etc.
#
. envisage/envisage_settings.sh

# decide which executable to use
#
if [[ -e ${SACOHOME}/bin/deco ]] ; then
    PROGRAM=${SACOHOME}/bin/deco
else
    PROGRAM=${SACOHOME}/src/interfaces/deadlock/shell/deadlock_shell
fi

# Execute mh_shell, we add '-ei_version 2' to the parameters since now
# saco's output uses the old easy interface language
#
${PROGRAM} $@ -ei_version 2 &> /tmp/deadlock.stderr

# If costabs exit with exit-code 0 we just print the output to the
# stdout, otheriwse we print an error message to the stdout as well.
#
if [ $? == 0 ]; then
    cat /tmp/costabs/output.xml
else
    echo "<ei_error>"
    echo "Error occurred while executing deadlock analysis:"
    echo ""
    cat /tmp/deadlock.stderr
    echo "</ei_error>"
fi

\rm -f /tmp/deadlock.stderr
