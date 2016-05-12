#!/bin/bash

### A wrapper script for SYCO (systematic testing tool for concurrent objects)
###
###

# execute environment_settings.sh to set some environment variables
# needed by costabs, etc.
#

. envisage/envisage_settings.sh

# decide which executable to use
#
if [[ -e ${SYCOHOME}/bin/syco ]] ; then
    PROGRAM=${SYCOHOME}/bin/syco
else
    PROGRAM=${SYCOHOME}/src/interfaces/shell/syco
fi

# Execute syco
#
${PROGRAM} $@ &> /tmp/syco.stderr

# If costabs exit with exit-code 0 we just print the output to the
# stdout, otherwise we print an error message to the stdout as well.
#
if [ $? == 0 ]; then
    cat /tmp/pet/output.xml    
else
    echo "<ei_error>"
    echo "syco exit with non-zero exit code: $?"
    cat /tmp/syco.stderr
    echo "</ei_error>"
fi

#\rm -f /tmp/syco.stderr
