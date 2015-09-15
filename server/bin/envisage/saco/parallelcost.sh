#!/bin/bash

### A wrapper script for SACO's Parallel Cost Analysis
###
###

# execute envisage_settings.sh to set some environment variables
# needed by costabs, etc.
#
. envisage/envisage_settings.sh

# decide which executable to use
#
if [[ -e ${SACOHOME}/bin/costabs ]] ; then
    PROGRAM=${SACOHOME}/bin/costabs
else
    PROGRAM=${SACOHOME}/src/interfaces/shell/costabs
fi

# Execute costabs, we add '-ei_version 2' to the parameters since now
# saco's output uses the old easy interface language
#
${PROGRAM} $@ -field_abstraction zero_one -parallel_cost yes -ei_version 2 &> /tmp/costabs.stderr

# If costabs exit with exit-code 0 we just print the output to the
# stdout, otherwise we print an error message to the stdout as well.
#
if [ $? == 0 ]; then
    cat /tmp/costabs/output.xml
else
    echo "<ei_error>"
    echo "Error occurred while executing the parallel cost:"
    echo ""
    cat /tmp/costabs.stderr
    echo "</ei_error>"
fi

rm -f /tmp/costabs.stderr
